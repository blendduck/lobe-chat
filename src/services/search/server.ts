import { lambdaClient } from '@/libs/trpc/client';
import { QueryFileListParams, QueryFileListSchemaType } from '@/types/files';

import { ISearchService } from './type';

export class ServerService implements ISearchService {
  getFile: ISearchService['getFile'] = async (id) => {
    const item = await lambdaClient.file.findById.query({ id });

    if (!item) {
      throw new Error('file not found');
    }

    return { ...item, type: item.fileType };
  };
  getFiles = async (params: QueryFileListParams) => {
    return lambdaClient.file.getFiles.query(params as QueryFileListSchemaType);
  };
}
