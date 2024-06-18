'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/store/quick-cart/cart.context';
import FloatingCartButton from '@/app/shared/floating-cart-button';
import CartDrawerView from '@/app/shared/ecommerce/cart/cart-drawer-view';
import { useParams, usePathname } from 'next/navigation';
import { routes } from '@/config/routes';
import { useSession } from 'next-auth/react';
import FloatingWhishlistButton from '../../floating-whishlist-button';
import WishlistDrawerView from './wishlist-drawer-view';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Text } from 'rizzui';
import { useAtom } from 'jotai';
import { wishlist } from '@/store/atoms';

const Drawer = dynamic(() => import('rizzui').then((module) => module.Drawer), {
  ssr: false,
});

export default function WishlistDrawer() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const session: any = useSession();
  // list of included pages
  const includedPaths: string[] = session.data.userData.userrole === "buyer" ? [
    '/',
    routes.eCommerce.shop,
    routes.eCommerce.productDetails(params?.slug as string),
  ] : [
    routes.eCommerce.shop,
    routes.eCommerce.productDetails(params?.slug as string),
  ];
  const [wishListProducts, setWishlistProducts] = useAtom(wishlist);

  const getData = async () => {
    if (session?.data?.userData) {
      const response: any = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-user-wishList/${session?.data?.userData?.id}`).catch(err => console.log(err));
      setWishlistProducts(response?.data?.wishlistProducts)
    } else {
      return []
    }
  }
  const removeItemFromWishlist = async (id: string | number) => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-from-wishlist`, { userid: session?.data?.userData?.id, productid: id }).then(res => {
      setWishlistProducts(wishListProducts.filter((product: any) => product.num_iid !== id))
      toast.success(<Text as='b'>Removed from wishlist</Text>);
      getData();
    }).catch(err => {
      console.log(err);
    })
  }
  const isPathIncluded = includedPaths?.some((path) => pathname === path);
  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const {
    clearItemFromCart,
    total,
    addItemToCart,
  } = useCart();
  return (
    <>
      {isPathIncluded ? (
        <FloatingWhishlistButton
          onClick={() => setOpenDrawer(true)}
          className="top-3/4 -translate-y-1/2 bg-primary dark:bg-primary"
          totalItems={wishListProducts?.length || 0}
        />
      ) : null}
      <Drawer
        isOpen={openDrawer ?? false}
        onClose={() => setOpenDrawer(false)}
        overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-md"
        containerClassName="dark:bg-gray-100"
        className="z-[9999]"
      >
        <WishlistDrawerView
          setOpenDrawer={setOpenDrawer}
          clearItemFromCart={clearItemFromCart}
          removeItemFromCart={removeItemFromWishlist}
          addItemToCart={addItemToCart}
          items={wishListProducts}
          total={total}
        />
      </Drawer>
    </>
  );
}
