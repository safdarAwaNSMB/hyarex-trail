'use client';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Title, Text } from 'rizzui';
import cn from '@/utils/class-names';
import WishlistButton from '@/components/wishlist-button';
import { generateSlug } from '@/utils/generate-slug';
import ColorSwatch from '@/utils/color-swatch';
import { Product } from '@/types';
import { toCurrency } from '@/utils/to-currency';

export default function ProductModernCard({
  product,
  className,
}: any) {
  const {
    title,
    pic_url,
    subjectTrans,
    imageUrl,
    slug,
    num_iid,
    description,
    price,
    sale_price,
    colors = [],
  } = product;
  return (
    <div className={cn(className)}>
      <Link
        href={routes.eCommerce.productDetails(
          String(num_iid ? slug ?? num_iid : slug ?? product?.offerId)
        )}
      >
        <div className="relative">
          <div className="relative mx-auto aspect-[5/5] w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              alt={subjectTrans}
              src={pic_url || imageUrl}
              fill
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <WishlistButton product={product} className="absolute end-3 top-3" />
        </div>
        <div className="pt-3">
          <Title
            as="h6"
            className="mb-1 truncate font-semibold transition-colors hover:text-primary"
          >
            {title || subjectTrans}
          </Title>
          {product?.seller_info && (
            <Text as="p" className="text-base">
              {product?.seller_info?.display_name}
              {product?.seller_info?.shop_name}
            </Text>
          )}

          <div className="mt-2 flex items-center font-semibold text-gray-900">
            {toCurrency(Number(price || product?.priceInfo?.price))}
            {sale_price && (
              <del className="ps-1.5 text-[13px] font-normal text-gray-500">
                {toCurrency(Number(sale_price))}
              </del>
            )}
          </div>
          {colors?.length ? <ColorSwatch colors={product?.colors} /> : null}
        </div>
      </Link>
    </div>
  );
}
