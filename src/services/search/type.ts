import { FileItem } from '@/types/files';

export interface ISearchService {
  getFile(id: string): Promise<FileItem>;
}
