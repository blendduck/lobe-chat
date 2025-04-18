import { ActionIcon } from '@lobehub/ui';
import { Compass, FolderClosed, MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useGlobalStore } from '@/store/global';
import { SidebarTabKey } from '@/store/global/initialState';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
import { useSessionStore } from '@/store/session';

export interface TopActionProps {
  isPinned?: boolean | null;
  tab?: SidebarTabKey;
}

const TopActions = memo<TopActionProps>(({ tab, isPinned }) => {
  const { t } = useTranslation('common');
  const switchBackToChat = useGlobalStore((s) => s.switchBackToChat);
  const { showMarket, enableKnowledgeBase, enableRAGSearch } =
    useServerConfigStore(featureFlagsSelectors);

  return (
    <>
      <Link
        aria-label={t('tab.chat')}
        href={'/chat'}
        onClick={(e) => {
          e.preventDefault();
          switchBackToChat(useSessionStore.getState().activeId);
        }}
      >
        <ActionIcon
          active={tab === SidebarTabKey.Chat && !isPinned}
          icon={MessageSquare}
          placement={'right'}
          size="large"
          title={t('tab.chat')}
        />
      </Link>
      {enableKnowledgeBase && (
        <Link aria-label={t('tab.files')} href={'/files'}>
          <ActionIcon
            active={tab === SidebarTabKey.Files}
            icon={FolderClosed}
            placement={'right'}
            size="large"
            title={t('tab.files')}
          />
        </Link>
      )}
      {enableRAGSearch && (
        <Link aria-label="文件搜索" href={'/search'}>
          <ActionIcon
            active={tab === SidebarTabKey.Search}
            icon={Search}
            placement={'right'}
            size="large"
            title={'文件搜索'}
          />
        </Link>
      )}
      {showMarket && (
        <Link aria-label={t('tab.discover')} href={'/discover'}>
          <ActionIcon
            active={tab === SidebarTabKey.Discover}
            icon={Compass}
            placement={'right'}
            size="large"
            title={t('tab.discover')}
          />
        </Link>
      )}
    </>
  );
});

export default TopActions;
