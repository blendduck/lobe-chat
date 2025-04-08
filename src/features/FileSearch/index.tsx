'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FileList from './FileList';
import Header from './Header';

interface FileSearchProps {
  category?: string;
  knowledgeBaseId?: string;
  title: string;
}
const FileSearch = memo<FileSearchProps>(({ knowledgeBaseId, category }) => {
  return (
    <>
      <Header knowledgeBaseId={knowledgeBaseId} />
      <Flexbox gap={12} height={'100%'}>
        <FileList category={category} knowledgeBaseId={knowledgeBaseId} />
      </Flexbox>
    </>
  );
});

export default FileSearch;
