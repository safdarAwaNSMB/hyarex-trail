'use client';

import { routes } from '@/config/routes';
import { getAllUsers, orderData } from '@/data/order-data';
import { invoiceData } from '@/data/invoice-data';
import { productsData } from '@/data/products-data';
import { getColumns } from '@/app/shared/invoice/invoice-list/columns';
import { getColumns as getUserColumns } from '@/app/shared/ecommerce/order/order-list/columns';
import BasicTableWidget from '@/components/controlled-table/basic-table-widget';
import TableLayout from '@/app/(hydrogen)/tables/table-layout';
// import { metaObject } from '@/config/site.config';
import axios from 'axios';
import { useEffect, useState } from 'react';

// export const metadata = {
//   ...metaObject('Basic Table'),
// };

const pageHeader = {
  title: 'Users List',
  breadcrumb: [
  ],
};

export default function BasicTablePage() {
  const [allUsers, setAllUsers] = useState<any>();
  const getUsersList = async () => {
    const data = await getAllUsers();
    setAllUsers(data.user)
  }
  useEffect(() => {
    getUsersList();
  }, [])
  console.log(allUsers);
  

  return (
    <TableLayout
      title={pageHeader.title}
      breadcrumb={pageHeader.breadcrumb}
      data={allUsers}
      fileName="order_data"
      header="Order ID,Name,Email,Avatar,Items,Price,Status,Created At,Updated At"
    >
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <BasicTableWidget
          variant="classic"
          title="Current Users"
          data={allUsers}
          // @ts-ignore
          getColumns={getUserColumns}
          enableSearch={false}
        />

        {/* <BasicTableWidget
          title="Modern Table"
          variant="modern"
          data={productsData}
          // @ts-ignore
          getColumns={getProductColumns}
          enableSearch={false}
          className="[&_.rc-table-content_table_tbody_tr:last-child_td]:border-0"
        />

        <BasicTableWidget
          title="Minimal Table"
          variant="minimal"
          data={invoiceData}
          // @ts-ignore
          getColumns={getColumns}
          enableSearch={false}
        />

        <BasicTableWidget
          title="Elegant Table"
          variant="elegant"
          data={productsData}
          // @ts-ignore
          getColumns={getProductColumns}
          enableSearch={false}
          className="[&_.rc-table-content_table_tbody_tr:last-child_td]:border-0"
        />

        <BasicTableWidget
          variant="retro"
          title="Retro Table"
          data={orderData}
          // @ts-ignore
          getColumns={getOrderColumns}
          enableSearch={false}
          className="[&_.rc-table-content_table_tbody_tr:last-child_td]:border-0"
        /> */}
      </div>
    </TableLayout>
  );
}
