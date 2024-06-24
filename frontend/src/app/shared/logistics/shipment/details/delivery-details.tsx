'use client';

import Image from 'next/image';
import { avatarIds } from '@/utils/get-avatar';
import { getRandomArrayElement } from '@/utils/get-random-array-element';
import { Title, Text, Avatar } from 'rizzui';
import cn from '@/utils/class-names';
import { formatDate } from '@/utils/format-date';
import signature from '@public/client-signature.svg';
import BasicTableWidget from '@/components/controlled-table/basic-table-widget';
import { PiXBold } from 'react-icons/pi';

interface DeliveryDetailsProps {
  className?: string;
}

export const getColumns = () => [
  // {
  //   title: <span className="ms-6 block whitespace-nowrap">Product</span>,
  //   dataIndex: 'name',
  //   key: 'name',
  //   width: 200,
  //   render: (date: Date) => (
  //     <span className="ms-6 block">
  //       <Text className="mb-1 font-medium text-gray-700">
  //         {formatDate(date, 'MMMM D, YYYY')}
  //       </Text>
  //       <Text className="text-[13px] text-gray-500">
  //         {formatDate(date, 'h:mm A')}
  //       </Text>
  //     </span>
  //   ),
  // },
  {
    title: <span className="block whitespace-nowrap">Product</span>,
    dataIndex: 'productData',
    key: 'productData',
    width: 200,
    render: (productData: any) => (
      <div className="flex items-start justify-start">
        <div className="relative me-4 aspect-[80/60] w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
          <Image
            fill
            className=" object-cover"
            src={productData?.productImage.images[0]}
            alt="Product image"
          />
        </div>
        <header>
          <Title as="h4" className="mb-0.5 w-full text-sm font-medium">
            {productData?.subjectTrans}
          </Title>
          <Text className="text-xs text-gray-500">
            {productData?.productSaleInfo.priceRangeList[0].startQuantity} Unit
            Price: ${productData?.productSaleInfo.priceRangeList[0].price}
          </Text>
        </header>
      </div>
    ),
  },
  {
    title: <span className="block whitespace-nowrap">Quantity</span>,
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100,
    render: (quantity: any) => (
      <div className="flex items-center">
        <PiXBold size={13} className="me-1 text-gray-500" />{' '}
        <Text
          as="span"
          className="font-medium text-gray-900 dark:text-gray-700"
        >
          {quantity}
        </Text>
      </div>
    ),
  },
  {
    title: <span className="block whitespace-nowrap">Total Price</span>,
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100,
    render: (_: any, row: any) => (
      <div className="flex items-center">
        ${Number(row?.quantity) *
          Number(
            row?.productData?.productSaleInfo.priceRangeList[0].price /
              row?.productData?.productSaleInfo.priceRangeList[0]
                .startQuantity
          )}
      </div>
    ),
  },
  
  {
    title: <span className="block whitespace-nowrap">Quoted Price</span>,
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100,
    render: (_: any, row: any) => (
      <div className="flex items-center">
        
                  <div className="w-full max-w-xs ps-4 md:w-1/2">
                    <Text className="font-medium text-gray-900 dark:text-gray-700">
                     ${Number(row.quotedPrice) + Number((row.quotedPrice/100) * row.adminCommision)}
                    </Text>
                  </div>
              
      </div>
    ),
  },
  // {
  //   title: <span className="block whitespace-nowrap">Received By</span>,
  //   dataIndex: 'receivedBy',
  //   key: 'receivedBy',
  //   width: 300,
  //   render: ({ name, avatar }: { name: string; avatar: string }) => (
  //     <div className="flex items-center">
  //       <Avatar name={name} src={avatar} size="sm" />
  //       <div className="ml-3 rtl:ml-0 rtl:mr-3">
  //         <Title as="h6" className="mb-0.5 !text-sm font-medium">
  //           {name}
  //         </Title>
  //       </div>
  //     </div>
  //   ),
  // },
  // {
  //   title: (
  //     <span className="block whitespace-nowrap">Receiver&apos;s Signature</span>
  //   ),
  //   dataIndex: 'receiversSignature',
  //   key: 'receiversSignature',
  //   width: 300,
  //   render: (receiversSignature: string) => (
  //     <Image src={signature} alt="clients signature" />
  //   ),
  // },
];

export default function DeliveryDetails({ data }: any) {
  return (
    <BasicTableWidget
      title="Quoted Products"
      className={cn('pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0')}
      data={data.products}
      getColumns={getColumns}
      noGutter
      enableSearch={false}
      scroll={{
        x: 900,
      }}
    />
  );
}
