'use client';
import FileDashboard from '@/app/shared/file/dashboard';
import { metaObject } from '@/config/site.config';
import { useSession } from 'next-auth/react';
import EcommerceDashboard from '../shared/ecommerce/dashboard';
import PageHeader from '../shared/page-header';
import FiltersButton from '../shared/filters-button';
import { routes } from '@/config/routes';
import dynamic from 'next/dynamic';
import ProductFeed from '../shared/ecommerce/shop/product-feed';
import CartDrawer from '../shared/ecommerce/cart/cart-drawer';
import { CartProvider } from '@/store/quick-cart/cart.context';
import WishlistDrawer from '../shared/ecommerce/cart/wishlist-drawer';
import ExecutiveDashboard from '../shared/executive';

// export const metadata = {
//   ...metaObject('Shop'),
// };

const ShopFilters = dynamic(
  () => import('@/app/shared/ecommerce/shop/shop-filters'),
  {
    ssr: false,
  }
);

export default function FileDashboardPage() {
  const session: any = useSession();

  const pageHeader = {
    title: 'Shop',
    breadcrumb: [
      {
        name: 'Home',
      },
      {
        name: 'Shop',
      },
    ],
  };


  return (
    <>
      {session?.data?.userData?.userrole === 'admin' || session?.data?.userData?.userrole == 'agent' ? (
        <>
        <ExecutiveDashboard />
        </>
      ) : (
        <>
          <CartProvider>
            <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
              <FiltersButton placement="right" modalView={<ShopFilters />} />
            </PageHeader>
            <ProductFeed />
            <CartDrawer />
            <WishlistDrawer />
          </CartProvider>
        </>
      )}

    </>
  );

}
