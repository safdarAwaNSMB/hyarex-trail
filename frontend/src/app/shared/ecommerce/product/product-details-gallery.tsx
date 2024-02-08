import Image from 'next/image';
import { useEffect, useState } from 'react';



export default function ProductDetailsGallery(product: any) {
  const [productImages, setProductImages] = useState<any>(null)
  useEffect(()=>{
    if(product.product){
      console.log('From Gallery');
      console.log(product.product.item_imgs);
      setProductImages(product.product.item_imgs);
    }
  }, [product])
  
  return (
    <div className="grid grid-cols-2 gap-3 @md:gap-4 @xl:gap-5 @2xl:gap-7">
      {productImages?.slice(0, 12)?.map((image : any, idx : number) => (
        <div
          key={`product-gallery-${idx}`}
          className="relative mx-auto aspect-[4/4.65] overflow-hidden rounded bg-gray-100 @xl:rounded-md"
        style={{
          width : '280px',
          height : '280px'
        }}
        >
          <Image
            fill
            priority
            src={image?.url}
            alt={'Product Gallery'}
            sizes="(max-width: 768px) 100vw"
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
