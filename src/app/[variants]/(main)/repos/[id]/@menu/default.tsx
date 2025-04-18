import { notFound } from 'next/navigation';
import { Flexbox } from 'react-layout-kit';

import { serverDB } from '@/database/server';
import { KnowledgeBaseModel } from '@/database/server/models/knowledgeBase';

import Head from './Head';
import Menu from './Menu';

interface Params {
  id: string;
}

type Props = { params: Params };

const MenuPage = async ({ params }: Props) => {
  // @patch
  const { id } = await params;
  const item = await KnowledgeBaseModel.findById(serverDB, id);

  if (!item) return notFound();

  return (
    <Flexbox gap={16} height={'100%'} paddingInline={12} style={{ paddingTop: 12 }}>
      <Head name={item.name} />
      <Menu id={id} />
    </Flexbox>
  );
};

MenuPage.displayName = 'Menu';

export default MenuPage;
