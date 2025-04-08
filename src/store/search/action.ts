import { SWRResponse } from 'swr';
import { StateCreator } from 'zustand/vanilla';

import { useClientDataSWR } from '@/libs/swr';
import { ragService } from '@/services/rag';

import { SearchStore } from './store';

export interface FileSearchAction {
  useGlobalSemanticSearch: (params: any) => SWRResponse<any[]>;
}

const FETCH_FILE_LIST_KEY = 'useGlobalSemanticSearch';

export const createFileSearchSlice: StateCreator<
  SearchStore,
  [['zustand/devtools', never]],
  [],
  FileSearchAction
> = (set) => ({
  useGlobalSemanticSearch: (params: any) => {
    return useClientDataSWR<any[]>(
      [FETCH_FILE_LIST_KEY, params],
      () => {
        if (!params.q) {
          return [];
        }
        return ragService.semanticSearchGlobal(params.q);
      },
      {
        onSuccess: (data) => {
          set({ fileList: data });
        },
      },
    );
  },
});
