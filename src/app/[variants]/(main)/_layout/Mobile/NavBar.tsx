'use client';

import { Icon } from '@lobehub/ui';
import { MobileTabBar, type MobileTabBarProps } from '@lobehub/ui/mobile';
import { createStyles } from 'antd-style';
import { Compass, MessageSquare, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { rgba } from 'polished';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useActiveTabKey } from '@/hooks/useActiveTabKey';
import { SidebarTabKey } from '@/store/global/initialState';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const useStyles = createStyles(({ css, token }) => ({
  active: css`
    svg {
      fill: ${rgba(token.colorPrimary, 0.33)};
    }
  `,
  container: css`
    position: fixed;
    z-index: 100;
    inset-block-end: 0;
    inset-inline: 0 0;
  `,
}));

const NavBar = memo(() => {
  const { t } = useTranslation('common');
  const { styles } = useStyles();
  const activeKey = useActiveTabKey();
  const router = useRouter();

  const { showMarket, enableRAGSearch } = useServerConfigStore(featureFlagsSelectors);

  const items: MobileTabBarProps['items'] = useMemo(
    () =>
      [
        {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={MessageSquare} />
          ),
          key: SidebarTabKey.Chat,
          onClick: () => {
            router.push('/chat');
          },
          title: t('tab.chat'),
        },
        // @patch
        enableRAGSearch && {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={Search} />
          ),
          key: SidebarTabKey.Search,
          onClick: () => {
            router.push('/search');
          },
          title: '文件搜索',
        },

        showMarket && {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={Compass} />
          ),
          key: SidebarTabKey.Discover,
          onClick: () => {
            router.push('/discover');
          },
          title: t('tab.discover'),
        },
        {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={User} />
          ),
          key: SidebarTabKey.Me,
          onClick: () => {
            router.push('/me');
          },
          title: t('tab.me'),
        },
      ].filter(Boolean) as MobileTabBarProps['items'],
    [t],
  );

  return <MobileTabBar activeKey={activeKey} className={styles.container} items={items} />;
});

NavBar.displayName = 'NavBar';

export default NavBar;
