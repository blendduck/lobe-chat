import { TRPCError } from '@trpc/server';
import OpenAI from 'openai';
import { z } from 'zod';

import { chainAnswerWithContext } from '@/chains/answerWithContext';
import { DEFAULT_MODEL } from '@/const/settings';
import { DEFAULT_FILE_EMBEDDING_MODEL_ITEM } from '@/const/settings/knowledge';
import { serverDB } from '@/database/server';
import { ChunkModel } from '@/database/server/models/chunk';
import { EmbeddingModel } from '@/database/server/models/embedding';
import { FileModel } from '@/database/server/models/file';
import {
  EvalDatasetRecordModel,
  EvalEvaluationModel,
  EvaluationRecordModel,
} from '@/database/server/models/ragEval';
import { asyncAuthedProcedure, asyncRouter as router } from '@/libs/trpc/async';
import { getServerDefaultFilesConfig } from '@/server/globalConfig';
import { initAgentRuntimeWithUserPayload } from '@/server/modules/AgentRuntime';
import { ChunkService } from '@/server/services/chunk';
import { AsyncTaskError } from '@/types/asyncTask';
import { EvalEvaluationStatus } from '@/types/eval';

const ragEvalProcedure = asyncAuthedProcedure.use(async (opts) => {
  const { ctx } = opts;

  return opts.next({
    ctx: {
      chunkModel: new ChunkModel(serverDB, ctx.userId),
      chunkService: new ChunkService(ctx.userId),
      datasetRecordModel: new EvalDatasetRecordModel(ctx.userId),
      embeddingModel: new EmbeddingModel(serverDB, ctx.userId),
      evalRecordModel: new EvaluationRecordModel(ctx.userId),
      evaluationModel: new EvalEvaluationModel(ctx.userId),
      fileModel: new FileModel(serverDB, ctx.userId),
    },
  });
});

export const ragEvalRouter = router({
  runRecordEvaluation: ragEvalProcedure
    .input(
      z.object({
        evalRecordId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const evalRecord = await ctx.evalRecordModel.findById(input.evalRecordId);

      if (!evalRecord) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Evaluation not found' });
      }

      const now = Date.now();
      try {
        const { model, provider } =
          getServerDefaultFilesConfig().embeddingModel || DEFAULT_FILE_EMBEDDING_MODEL_ITEM;

        // @patch
        const agentRuntime = await initAgentRuntimeWithUserPayload(provider, {
          ...ctx.jwtPayload,
          apiKey: undefined,
          baseURL: undefined,
        });

        const { question, languageModel } = evalRecord;

        let questionEmbeddingId = evalRecord.questionEmbeddingId;
        let context = evalRecord.context;

        // 如果不存在 questionEmbeddingId，那么就需要做一次 embedding
        if (!questionEmbeddingId) {
          const embeddings = await agentRuntime.embeddings({
            dimensions: 1024,
            input: question,
            model,
          });

          const embeddingId = await ctx.embeddingModel.create({
            embeddings: embeddings?.[0],
            model,
          });

          await ctx.evalRecordModel.update(evalRecord.id, {
            questionEmbeddingId: embeddingId,
          });

          questionEmbeddingId = embeddingId;
        }

        // 如果不存在 context，那么就需要做一次检索
        if (!context || context.length === 0) {
          const datasetRecord = await ctx.datasetRecordModel.findById(evalRecord.datasetRecordId);

          const embeddingItem = await ctx.embeddingModel.findById(questionEmbeddingId);

          const chunks = await ctx.chunkModel.semanticSearchForChat({
            embedding: embeddingItem!.embeddings!,
            fileIds: datasetRecord!.referenceFiles!,
            query: evalRecord.question,
          });

          context = chunks.map((item) => item.text).filter(Boolean) as string[];
          await ctx.evalRecordModel.update(evalRecord.id, { context });
        }

        // 做一次生成 LLM 答案生成
        const { messages } = chainAnswerWithContext({ context, knowledge: [], question });

        const response = await agentRuntime.chat({
          messages: messages!,
          model: !!languageModel ? languageModel : DEFAULT_MODEL,
          responseMode: 'json',
          stream: false,
          temperature: 1,
        });

        const data = (await response.json()) as OpenAI.ChatCompletion;

        const answer = data.choices[0].message.content;

        await ctx.evalRecordModel.update(input.evalRecordId, {
          answer,
          duration: Date.now() - now,
          languageModel,
          status: EvalEvaluationStatus.Success,
        });

        return { success: true };
      } catch (e) {
        await ctx.evalRecordModel.update(input.evalRecordId, {
          error: new AsyncTaskError((e as Error).name, (e as Error).message),
          status: EvalEvaluationStatus.Error,
        });

        await ctx.evaluationModel.update(evalRecord.evaluationId, {
          status: EvalEvaluationStatus.Error,
        });

        console.error('[RAGEvaluation] error', e);

        return { success: false };
      }
    }),
});
