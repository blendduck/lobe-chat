'use client';

import { Typography } from 'antd';
import { useQueryState } from 'nuqs';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';
import { Virtuoso } from 'react-virtuoso';

import { useFileSearchStore } from '@/store/search';
import { SortType } from '@/types/files';

import FileListItem from './FileListItem';
import FileSkeleton from './FileSkeleton';

interface FileListProps {
  category?: string;
  knowledgeBaseId?: string;
}

const FileList = memo<FileListProps>(() => {
  const { t } = useTranslation('components');

  const [query] = useQueryState('q', {
    clearOnDefault: true,
  });

  const [sorter] = useQueryState('sorter', {
    clearOnDefault: true,
    defaultValue: 'createdAt',
  });
  const [sortType] = useQueryState('sortType', {
    clearOnDefault: true,
    defaultValue: SortType.Desc,
  });

  const useGlobalSemanticSearch = useFileSearchStore((s) => s.useGlobalSemanticSearch);

  const { data, isLoading } = useGlobalSemanticSearch({
    q: query,
    sortType,
    sorter,
  });

  console.log('FileSearch data =', data, isLoading);

  // useCheckTaskStatus(data);

  return !isLoading && data?.length === 0 ? undefined : (
    <Flexbox height={'100%'}>
      {isLoading ? (
        <FileSkeleton />
      ) : (
        <Virtuoso
          components={{
            Footer: () => (
              <Center style={{ height: 64 }}>
                <Typography.Text style={{ fontSize: 12 }} type={'secondary'}>
                  {t('FileManager.bottom')}
                </Typography.Text>
              </Center>
            ),
          }}
          data={data}
          itemContent={(index, item) => <FileListItem index={index} key={item.id} {...item} />}
          style={{ flex: 1 }}
        />
      )}
    </Flexbox>
  );
});

export default FileList;
