'use client';

import { useParams } from 'next/navigation';
import ProductDetailsRelatedProducts from '@/app/shared/ecommerce/product/product-details-related-products';
import ProductDetailsDescription from '@/app/shared/ecommerce/product/product-details-description';
import ProductDeliveryOptions from '@/app/shared/ecommerce/product/product-delivery-options';
import ProductDetailsGallery from '@/app/shared/ecommerce/product/product-details-gallery';
import ProductDetailsSummery from '@/app/shared/ecommerce/product/product-details-summery';
import ProductDetailsReview from '@/app/shared/ecommerce/product/product-details-review';
import { modernProductsGrid } from '@/data/shop-products';
import { generateSlug } from '@/utils/generate-slug';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { productToShow } from '@/store/atoms';

export default function ProductDetails() {

  const product = useAtomValue(productToShow);

  return (
    <div className="@container">
      <div className="@3xl:grid @3xl:grid-cols-12">
        <div className="col-span-7 mb-7 @container @lg:mb-10 @3xl:pe-10">
          <ProductDetailsGallery />
        </div>
        <div className="col-span-5 @container">
          <ProductDetailsSummery />
          {/* <ProductDeliveryOptions product={product?.product} /> */}
          {/* <ProductDetailsReview product={product?.product} /> */}
        </div>
      </div>
      <ProductDetailsDescription />
      {/* <ProductDetailsRelatedProducts /> */}
    </div>
  );
}
