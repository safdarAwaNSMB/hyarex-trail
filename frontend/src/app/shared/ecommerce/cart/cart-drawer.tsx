'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/store/quick-cart/cart.context';
import FloatingCartButton from '@/app/shared/floating-cart-button';
import CartDrawerView from '@/app/shared/ecommerce/cart/cart-drawer-view';
import { useParams, usePathname } from 'next/navigation';
import { routes } from '@/config/routes';
import { useSession } from 'next-auth/react';
import { useAtom } from 'jotai';
import { currentQuotation, products } from '@/store/atoms';
import axios from 'axios';
import { Text } from 'rizzui';
import toast from 'react-hot-toast';

const Drawer = dynamic(() => import('rizzui').then((module) => module.Drawer), {
  ssr: false,
});

export default function CartDrawer() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const session: any = useSession();
  // list of included pages
  const includedPaths: string[] =
    session.data.userData.userrole === 'buyer'
      ? [
          '/',
          routes.eCommerce.shop,
          routes.eCommerce.productDetails(params?.slug as string),
        ]
      : [
          routes.eCommerce.shop,
          routes.eCommerce.productDetails(params?.slug as string),
        ];
  const [quotation, setQuotation] = useAtom(currentQuotation);

  const getData = async () => {
    if (session?.data?.userData) {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-user-current-quotation/${session?.data?.userData?.email}`).then((res: any) => {
        console.log(res.data)
        setQuotation(res.data)
      }).catch((err) => console.log(err));
      // setQuotation(response?.data?.quotation)
      // console.log(response.data);
    } else {
      return [];
    }
  };

  const removeItemFromQuotation = async (id: string | number) => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/remove-from-current-quotation`, { userEmail: session?.data?.userData?.email, productId: id }).then(res => {
      
      const updatedProducts = quotation.products.filter((product : any) => product.productData?.offerId !== id)
      console.log(updatedProducts);
      
      setQuotation({...quotation, products : updatedProducts})
      toast.success(<Text as='b'>Removed from Quotation</Text>);
      getData();
    }).catch(err => {
      console.log(err);
    })
  }
  console.log(quotation);
  
  const isPathIncluded = includedPaths.some((path) => pathname === path);
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    totalItems,
    items,
    removeItemFromCart,
    clearItemFromCart,
    total,
    addItemToCart,
  } = useCart();
  return (
    <>
      {isPathIncluded ? (
        <FloatingCartButton
          onClick={() => setOpenDrawer(true)}
          className="top-1/2 -translate-y-1/2 bg-primary dark:bg-primary"
          totalItems={quotation?.products?.length || 0}
        />
      ) : null}
      <Drawer
        isOpen={openDrawer ?? false}
        onClose={() => setOpenDrawer(false)}
        overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
        containerClassName="dark:bg-gray-100"
        className="z-[9999]"
      >
        <CartDrawerView
          setOpenDrawer={setOpenDrawer}
          clearItemFromCart={clearItemFromCart}
          removeItemFromCart={removeItemFromQuotation}
          addItemToCart={addItemToCart}
          items={quotation?.products}
          total={total}
        />
      </Drawer>
    </>
  );
}
