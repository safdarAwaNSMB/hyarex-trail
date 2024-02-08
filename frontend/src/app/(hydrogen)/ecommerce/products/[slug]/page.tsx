'use client';

import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';
import { useEffect, useState } from 'react';
import axios from 'axios';
import WishlistDrawer from '@/app/shared/ecommerce/cart/wishlist-drawer';

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

  const options = {
    method: 'GET',
    url: 'https://alibaba-1688-data-service.p.rapidapi.com/item/itemFullInfo',
    params: {
      itemId: params.slug
    },
    headers: {
      'X-RapidAPI-Key': '1013c5ec66msh372a762a07eeb8fp1803b5jsna65e28c27f18',
      'X-RapidAPI-Host': 'alibaba-1688-data-service.p.rapidapi.com'
    }
  };

  const [product, setProduct] = useState<any>()

  const getProductData = async () => {
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setProduct(response.data)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProductData();
  }, [])



  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProductDetails product={product} />
      <WishlistDrawer />
    </>
  );
}
