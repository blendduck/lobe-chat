import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import { rgba } from 'polished';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FileIcon from '@/components/FileIcon';
import { formatSize } from '@/utils/format';


dayjs.extend(relativeTime);

export const FILE_DATE_WIDTH = 160;
export const FILE_SIZE_WIDTH = 140;

const useStyles = createStyles(({ css, token, cx, isDarkMode }) => {
  const hover = css`
    opacity: 0;
  `;
  return {
    checkbox: hover,
    container: css`
      cursor: pointer;
      margin-inline: 24px;
      border-block-end: 1px solid ${isDarkMode ? token.colorSplit : rgba(token.colorSplit, 0.06)};

      &:hover {
        background: ${token.colorFillTertiary};

        .${cx(hover)} {
          opacity: 1;
        }
      }

      .chunk-tag {
        opacity: 1;
      }
    `,

    hover,
    item: css`
      padding-block: 0;
      padding-inline: 0 24px;
      color: ${token.colorTextSecondary};
    `,
    name: css`
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;

      margin-inline-start: 12px;

      color: ${token.colorText};
    `,
    selected: css`
      background: ${token.colorFillTertiary};

      &:hover {
        background: ${token.colorFillSecondary};
      }
    `,
  };
});

interface FileRenderItemProps {
  createdAt: string;
  fileId: string;
  fileType: string;
  name: string;
  size: number;
}

const FileRenderItem = memo<FileRenderItemProps>(({ size, name, fileType, fileId, createdAt }) => {
  const { styles, cx } = useStyles();
  const router = useRouter();

  const displayTime =
    dayjs().diff(dayjs(createdAt), 'd') < 7
      ? dayjs(createdAt).fromNow()
      : dayjs(createdAt).format('YYYY-MM-DD');

  return (
    <Flexbox
      align={'center'}
      className={cx(styles.container, styles.selected)}
      height={64}
      horizontal
    >
      <Flexbox
        align={'center'}
        className={styles.item}
        distribution={'space-between'}
        flex={1}
        horizontal
        onClick={() => {
          router.push(`/files/${fileId}`);
        }}
      >
        <Flexbox align={'center'} horizontal>
          <FileIcon fileName={name} fileType={fileType} />
          <span className={styles.name}>{name}</span>
        </Flexbox>
      </Flexbox>
      <Flexbox className={styles.item} width={FILE_DATE_WIDTH}>
        {displayTime}
      </Flexbox>
      <Flexbox className={styles.item} width={FILE_SIZE_WIDTH}>
        {formatSize(size)}
      </Flexbox>
    </Flexbox>
  );
});

export default FileRenderItem;
