'use client';

// import { Select } from 'antd';
import { Typography } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FilesSearchBar from './FilesSearchBar';

const Header = memo<{ knowledgeBaseId?: string }>(() => {
  return (
    <Flexbox distribution={'space-between'} paddingBlock={12} paddingInline={24}>
      <Flexbox align="center" gap={8} horizontal padding={12}>
        <Typography.Text style={{ fontSize: 16, fontWeight: 'bold' }}>智能文件搜索</Typography.Text>
        <FilesSearchBar />
      </Flexbox>
      {/* <Flexbox className='pt-2' gap={8} horizontal >
        <Select
          defaultValue='medium'
          options={[
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ]}
        />
      </Flexbox> */}
    </Flexbox>
  );
});

export default Header;
