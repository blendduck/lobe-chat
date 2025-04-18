import { Icon } from '@lobehub/ui';
import { MenuItemType } from 'antd/es/menu/interface';
import { Blocks, Bot, BrainCog, MessagesSquare, Mic2, UserCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { MenuProps } from '@/components/Menu';
import { INBOX_SESSION_ID } from '@/const/session';
import { ChatSettingsTabs } from '@/store/global/initialState';
import { useSessionStore } from '@/store/session';
import { sessionMetaSelectors } from '@/store/session/selectors';

interface UseCategoryOptions {
  mobile?: boolean;
}

export const useCategory = ({ mobile }: UseCategoryOptions = {}) => {
  const { t } = useTranslation('setting');
  const iconSize = mobile ? { fontSize: 20 } : undefined;
  const id = useSessionStore((s) => s.activeId);
  const meta = useSessionStore(sessionMetaSelectors.currentAgentMeta);

  const isInbox = id === INBOX_SESSION_ID;

  const cateItems: MenuProps['items'] = useMemo(
    () =>
      [
        (!isInbox && {
          icon: <Icon icon={UserCircle} size={iconSize} />,
          key: ChatSettingsTabs.Meta,
          label: t('agentTab.meta'),
        }) as MenuItemType,
        (!meta.hidden && {
          icon: <Icon icon={Bot} size={iconSize} />,
          key: ChatSettingsTabs.Prompt,
          label: t('agentTab.prompt'),
        }) as MenuItemType,
        {
          icon: <Icon icon={MessagesSquare} size={iconSize} />,
          key: ChatSettingsTabs.Chat,
          label: t('agentTab.chat'),
        },
        {
          icon: <Icon icon={BrainCog} size={iconSize} />,
          key: ChatSettingsTabs.Modal,
          label: t('agentTab.modal'),
        },
        {
          icon: <Icon icon={Mic2} size={iconSize} />,
          key: ChatSettingsTabs.TTS,
          label: t('agentTab.tts'),
        },
        {
          icon: <Icon icon={Blocks} size={iconSize} />,
          key: ChatSettingsTabs.Plugin,
          label: t('agentTab.plugin'),
        },
      ].filter(Boolean),
    [t, isInbox],
  );

  return cateItems;
};
