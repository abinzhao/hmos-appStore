import React from 'react';
import { Card, Table } from '@arco-design/web-react';
import { columns, data } from './contants';

function AppListPage() {
  return (
    <Card style={{ height: '80vh', overflow: 'auto' }}>
      <Table
        style={{ width: '100%' }}
        columns={columns}
        data={data}
        scroll={{
          x: 1600,
        }}
      />
    </Card>
  );
}

export default AppListPage;
