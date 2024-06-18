'use client';

import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';
import { useEffect, useState } from 'react';
import axios from 'axios';
import WishlistDrawer from '@/app/shared/ecommerce/cart/wishlist-drawer';
import { productToShow } from '@/store/atoms';
import { useAtom } from 'jotai';

// export const metadata = {
//   ...metaObject('Product Details'),
// };


export default function ProductDetailsPage({ params }: any) {
  const pageHeader = {
    title: 'Shop',
    breadcrumb: [
      {
        href: '/',
        name: 'Shop',
      },

    ],
  };
  const [loadingData, setLoadingData] = useState(true)

  const options = {
    method: 'GET',
    url: `https://www.lovbuy.com/1688api/getproductinfo2.php?key=${process.env.NEXT_PUBLIC_API_KEY}&item_id=${params.slug}&lang=en`,
  };

  const [product, setProduct] = useAtom(productToShow)

  const getProductData = async () => {
    try {
      const response = await axios.request(options);
      console.log(response);
      setProduct(response?.data?.result?.result);
      setLoadingData(false)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProductData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      {loadingData ?
        <div className='w-full flex justify-center'>
          <div className='spinner'></div>
        </div>
        :
        <ProductDetails />
      }
      <WishlistDrawer />
    </>
  );
}
