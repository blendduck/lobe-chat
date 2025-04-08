import { Flexbox } from 'react-layout-kit';

import { LayoutProps } from '../type';

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flexbox flex={1} style={{ overflow: 'hidden', position: 'relative' }}>
      {children}
    </Flexbox>
  );
};

Layout.displayName = 'DesktopFileLayout';

export default Layout;
