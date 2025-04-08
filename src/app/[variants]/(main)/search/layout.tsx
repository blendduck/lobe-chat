import { notFound } from 'next/navigation';
import { PropsWithChildren } from 'react';

import { serverFeatureFlags } from '@/config/featureFlags';

export default ({ children }: PropsWithChildren) => {
  const enableRAGSearch = serverFeatureFlags().enableRAGSearch;

  if (!enableRAGSearch) return notFound();

  return children;
};
