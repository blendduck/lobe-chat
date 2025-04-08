import { FileListItem, QueryFileListParams } from '@/types/files';

export type SearchStoreState = {
  fileList: FileListItem[];
  isSearching: boolean;
  queryListParams?: QueryFileListParams;
};

export const initialState: SearchStoreState = {
  fileList: [],
  isSearching: false,
};
