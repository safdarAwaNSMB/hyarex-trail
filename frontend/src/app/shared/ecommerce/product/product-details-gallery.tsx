import { productToShow } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ProductDetailsDescription from './product-details-description';



export default function ProductDetailsGallery() {
  const product = useAtomValue(productToShow);
  const [productImages, setProductImages] = useState<any>(null)
  const [showIndex, setShowIndex] = useState(0);
  useEffect(() => {
    if (product) {
      console.log('From Gallery');
      console.log(product);

      console.log(product.productImage.images);
      setProductImages(product.productImage.images);
    }
  }, [product])

  return (
    <div>
      <div className="relative mx-auto overflow-hidden rounded bg-gray-100 @xl:rounded-md" style={{
        width: "400px",
        height: "400px"
      }}>
        <Image
          
          priority
          src={productImages ? productImages[showIndex] : ""}
          alt={'Product Gallery'}
          width={400}
          height={400}
          // sizes="(max-width: 768px) 100vw"
          className="h-full w-full object-cover"
        />
      </div>
      <div className='flex flex-row justify-start gap-1 w-full h-32 my-5'>
        {productImages?.slice(0, 12)?.map((image: any, index: number) => (
          <div
            key={`product-gallery-${index}`}
            className={`rounded ${showIndex === index && "border-2 border-black"} bg-gray-100 @xl:rounded-md`}
            style={{
              width: "130px"
            }}
            onClick={() => setShowIndex(index)}
          >
            <Image
              width={130}
              height={100}
              src={image}
              alt={'Product Gallery'}
            className='w-full h-full object-cover rounded @xl:rounded-md'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
