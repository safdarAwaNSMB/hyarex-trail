'use client';

import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import OrderProducts from '@/app/shared/ecommerce/checkout/order-products';
import { toCurrency } from '@/utils/to-currency';
import { Title, Text, Button, EmptyProductBoxIcon, Radio } from 'rizzui';
import cn from '@/utils/class-names';
import { routes } from '@/config/routes';
import { CartItem } from '@/types';
import DrawerHeader from '@/app/shared/drawer-header';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useAtom } from 'jotai';
import { currentQuotation } from '@/store/atoms';

type CartDrawerViewProps = {
  items: CartItem[];
  total: number;
  addItemToCart: (item: CartItem, quantity: number) => void;
  removeItemFromCart: (id: number) => void;
  clearItemFromCart: (id: number) => void;
  setOpenDrawer: (id: boolean) => void;
};

export default function CartDrawerView({
  items,
  total,
  addItemToCart,
  removeItemFromCart,
  clearItemFromCart,
  setOpenDrawer,
}: CartDrawerViewProps) {
  const quotationTypes = [
    { title: 'Without Branding', name: 'withoutBranding' },
    { title: 'With Branding', name: 'withBranding' },
    { title: 'Dropshipping', name: 'dropshipping' },
    { title: 'Wholesale', name: 'wholesale' },
  ];
  const [selectedType, setSelectedType] = useState<string>('');
  const isCartEmpty = isEmpty(items);
  const session: any = useSession();
  const [quotation, setQuotation] = useAtom(currentQuotation)

  const sendQuotation = async ()=>{
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-quotation`, { userEmail: session?.data?.userData?.email, quotationType : selectedType }).then(res => {
      setQuotation(null);
      setSelectedType('')
      setOpenDrawer(false)
      toast.success(<Text as='b'>Quotation Sended</Text>);
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="flex h-full w-full flex-col">
      <DrawerHeader
        heading="Shopping Cart"
        onClose={() => setOpenDrawer(false)}
      />

      {isCartEmpty ? (
        <div className="grid h-full place-content-center">
          <EmptyProductBoxIcon className="mx-auto h-auto w-52 text-gray-400" />
          <Title as="h5" className="mt-6 text-center">
            Your quotation is empty
          </Title>
        </div>
      ) : (
        <>
          <OrderProducts
            items={items}
            showControls
            className="mb-5 gap-0 divide-y border-b border-gray-100"
            itemClassName="p-4 pb-5 md:px-6"
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
            clearItemFromCart={clearItemFromCart}
          />
          <div className=" mx-2">
            <Title as="h6" className="font-inter font-semibold">
              Select Type of Purchase
            </Title>
            {quotationTypes?.map((quotationType: any) => (
              <Radio
                key={`${quotationType.name}`}
                label={quotationType.title}
                name={quotationType.name}
                // value={item.slug}
                checked={selectedType === quotationType.name}
                onChange={() => setSelectedType(quotationType.name)}
                className="[&>label>span]:font-medium "
                inputClassName="dark:checked:!bg-gray-300 dark:checked:!border-gray-300 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-0 my-1"
              />
            ))}
          </div>
        </>
      )}

      {isCartEmpty ? (
        <div className="px-4 py-5">
          <Button
            className="w-full"
            variant="flat"
            onClick={() => setOpenDrawer(false)}
          >
            Back To Shop
          </Button>
        </div>
      ) : (
        <>
          <Button
            onClick={()=>{
              if(selectedType?.length > 0){
                sendQuotation()
              } else {
                toast.error('Please select quitation Type!')
              }
            }}  
            className={cn(
              'mx-4 mb-6 mt-auto flex items-center justify-center rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground md:mx-6'
            )}
          >
            Send Quotation Request
          </Button>
        </>
      )}
    </div>
  );
}
