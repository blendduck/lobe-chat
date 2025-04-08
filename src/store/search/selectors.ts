import { SearchStoreState } from './initialState';

const getFileById = (id?: string | null) => (s: SearchStoreState) => {
  if (!id) return;

  return s.fileList.find((item) => item.id === id);
};

// const data = await ragService.semanticSearch(text, [fileId]);
export const fileSearchSelectors = {
  getFileById,
};
