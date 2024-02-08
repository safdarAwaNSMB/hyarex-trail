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

export default function ProductDetails(product: any) {
  

  return (
    <div className="@container">
      <div className="@3xl:grid @3xl:grid-cols-12">
        <div className="col-span-7 mb-7 @container @lg:mb-10 @3xl:pe-10">
          <ProductDetailsGallery product={product?.product} />
        </div>
        <div className="col-span-5 @container">
          <ProductDetailsSummery product={product?.product} />
          <ProductDeliveryOptions product={product?.product} />
          {/* <ProductDetailsDescription product={product?.product} /> */}
          <ProductDetailsReview product={product?.product} />
        </div>
      </div>
      <ProductDetailsRelatedProducts product={product?.product} />
    </div>
  );
}
