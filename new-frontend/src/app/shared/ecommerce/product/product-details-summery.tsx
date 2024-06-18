'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import { PiShoppingCartSimple } from 'react-icons/pi';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Product } from '@/types';
import { Button, Title, Text, AdvancedRadio, RadioGroup } from 'rizzui';
import { toCurrency } from '@/utils/to-currency';
import GetSize from '@/app/shared/ecommerce/product/get-size';
import { calculatePercentage } from '@/utils/calculate-percentage';
import { GetColor } from '@/app/shared/ecommerce/product/get-color';
import WishlistButton from '@/app/shared/ecommerce/product/wishlist-button';
import { useCart } from '@/store/quick-cart/cart.context';
import {
  ProductDetailsInput,
  productDetailsSchema,
} from '@/utils/validators/product-details.schema';
import { generateCartProduct } from '@/store/quick-cart/generate-cart-product';
import { useAtom, useAtomValue } from 'jotai';
import { currentQuotation, productToShow } from '@/store/atoms';
import cn from '@/utils/class-names';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const knownColors = [
  'Black',
  'White',
  'Gray',
  'Silver',
  'Charcoal',
  'Red',
  'Burgundy',
  'Maroon',
  'Pink',
  'Coral',
  'Orange',
  'Peach',
  'Amber',
  'Gold',
  'Yellow',
  'Green',
  'Olive',
  'Lime',
  'Emerald',
  'Teal',
  'Blue',
  'Navy',
  'Royal Blue',
  'Sky Blue',
  'Turquoise',
  'Purple',
  'Lavender',
  'Mauve',
  'Indigo',
  'Violet',
  'Brown',
  'Tan',
  'Beige',
  'Khaki',
  'Chocolate',
];

const cssValues: any = {
  Black: '#000000',
  White: '#FFFFFF',
  Gray: '#808080',
  Silver: '#C0C0C0',
  Charcoal: '#36454F',
  Red: '#FF0000',
  Burgundy: '#800020',
  Maroon: '#800000',
  Pink: '#FFC0CB',
  Coral: '#FF7F50',
  Orange: '#FFA500',
  Peach: '#FFDAB9',
  Amber: '#FFBF00',
  Gold: '#FFD700',
  Yellow: '#FFFF00',
  Green: '#008000',
  Olive: '#808000',
  Lime: '#00FF00',
  Emerald: '#50C878',
  Teal: '#008080',
  Blue: '#0000FF',
  Navy: '#000080',
  'Royal Blue': '#4169E1',
  'Sky Blue': '#87CEEB',
  Turquoise: '#40E0D0',
  Purple: '#800080',
  Lavender: '#E6E6FA',
  Mauve: '#E0B0FF',
  Indigo: '#4B0082',
  Violet: '#EE82EE',
  Brown: '#A52A2A',
  Tan: '#D2B48C',
  Beige: '#F5F5DC',
  Khaki: '#C3B091',
  Chocolate: '#D2691E',
};
type FormTypes = {
  productId: number;
  quantity: number;
  requirements?: string;
};

export default function ProductDetailsSummery() {
  const { addItemToCart } = useCart();
  const product = useAtomValue(productToShow);
  const [quotation, setQuotation] = useAtom(currentQuotation)
  const [isLoading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<FormTypes>({
    productId: product?.offerId,
    quantity: 1,
    requirements: '',
  });
  const session: any = useSession();

  const methods = useForm<ProductDetailsInput>({
    mode: 'onChange',
    // defaultValues: defaultValues(order),
    resolver: zodResolver(productDetailsSchema),
  });

  const updateValues = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formValues);
    setLoading(true);
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/add-to-quotation`, { userEmail: session?.data?.userData?.email, ...formValues }).then(res => {
      // setFavoriteProducts([...favoriteProducts, product])
      console.log('added on backend');
      
      setQuotation({...quotation, products : quotation.products ? [...quotation.products, {...formValues, productData : product}] : [{...formValues, productData : product}]})
        toast.success(<Text as="b">Added in Quotation!</Text>)
    
    }).catch(err => {
      console.log(err);
    }).finally(() => setLoading(false))

  };
  const sizes = product?.productAttribute?.filter(
    (attribute: any) => attribute.attributeNameTrans === 'Size'
  );
  const colors = product?.productAttribute?.filter(
    (attribute: any) =>
      attribute.attributeNameTrans === 'Color' &&
      knownColors.includes(attribute.valueTrans)
  );

  // console.log('errors', methods.formState.errors?.productColor);

  return (
    <>
      <div className="border-b border-muted pb-6 @lg:pb-8">
        <Title as="h2" className="mb-2.5 font-bold @6xl:text-4xl">
          {product?.subjectTrans}
        </Title>

        {/* {product?.product?.location && (
          <Text as="p" className="text-base">
          {product?.product?.location?.city || product?.product?.location?.City + ",   " + product?.product?.location?.state || product?.product?.location.State}
        </Text>
          )} */}
      </div>

      <FormProvider {...methods}>
        <form className="pb-8 pt-5" onSubmit={onSubmit}>
          <div className="mb-1.5 mt-2 flex items-end font-lexend text-base">
            <div className="-mb-0.5 text-2xl font-semibold text-gray-900 lg:text-3xl">
              {product?.productSaleInfo.priceRangeList?.map(
                (priceObj: any, i: number) => {
                  return (
                    <p key={i}>
                      ${priceObj.price} for {priceObj?.startQuantity} items
                    </p>
                  );
                }
              )}
              {/* {toCurrency(Number(product?.) as number)} */}
            </div>
            {/* <del className="ps-1.5 font-medium text-gray-500">
              {toCurrency(product?.sale_price as number)}
            </del> */}
            {/* <div className="ps-1.5 text-red">
              ({calculatePercentage(295, 320)}% OFF)
            </div> */}
          </div>
          <div className="font-medium text-green-dark">
            Inclusive of all taxes
          </div>
          {/* {colors?.length > 0 && (
            <div>
              Colors : {colors?.map((attribute: any) => {
                return <><b>{attribute.valueTrans}</b> | </>
              })}
            </div>
          )} */}

          <div className="mb-3.5 flex flex-col justify-between pt-6">
            {sizes?.length > 0 && (
              <>
                <div className="flex flex-col">
                  <h4 className="w-100 mb-1">Select Size</h4>
                  <div>
                    <RadioGroup
                      value=""
                      setValue={() => {}}
                      className="flex flex-wrap items-center gap-4"
                    >
                      {sizes?.length > 0 &&
                        sizes?.map((attribute: any) => (
                          <AdvancedRadio
                            key={attribute.attributeId}
                            value={attribute?.valueTrans}
                            contentClassName={cn(
                              'px-3 py-2 min-w-[unset] min-h-[unset] flex items-center justify-between content-classname'
                              // String(attribute.valueTrans) === String(attribute.valueTrans) &&
                              // 'border-primary ring-primary ring-1'
                            )}
                          >
                            {attribute.valueTrans}
                          </AdvancedRadio>
                        ))}
                    </RadioGroup>
                  </div>
                </div>
              </>
            )}

            {colors?.length > 0 && (
              <>
                <div className="mt-3 flex flex-col">
                  <h4 className="w-100 mb-1">Select Color</h4>
                  <div className="w-100 flex flex-row flex-wrap">
                    {colors?.length > 0 &&
                      colors?.map((attribute: any) => (
                        <span
                          className={cn(
                            "relative m-1 h-6 w-6 cursor-pointer rounded-full border-white before:absolute before:start-1/2 before:top-1/2 before:h-[26px] before:w-[26px] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:content-[''] dark:border-muted ltr:before:-translate-x-1/2 rtl:before:translate-x-1/2"
                            // attribute?.valueTrans === attribute.valueTrans &&
                            // 'border-4 before:border before:border-gray-900'
                          )}
                          style={{
                            backgroundColor: cssValues[attribute.valueTrans],
                          }}
                          key={attribute.attributeId}
                          onClick={
                            () => {}
                            // setValue('productColor', {
                            //   name: color.name,
                            //   code: color.code,
                            // })
                          }
                        />
                      ))}
                  </div>
                </div>
              </>
            )}

            {/* <Button size="sm" variant="text" className="h-auto py-0 underline">
              Size Guide
            </Button> */}
          </div>

          {/* {!isEmpty(product.sizes) && <GetSize sizes={product.sizes} />} */}

          {/* <Title as="h6" className="mb-3.5 mt-6 font-inter text-sm font-medium">
            Select Color
          </Title> */}

          {/* <GetColor colors={product?.colors ?? []} /> */}

          <div className="grid grid-cols-1 gap-4 pt-7 @md:grid-cols-2 @xl:gap-6">
            <Button
              size="xl"
              type="submit"
              isLoading={isLoading}
              className="h-12 text-sm lg:h-14 lg:text-base"
            >
              <PiShoppingCartSimple className="me-2 h-5 w-5 lg:h-[22px] lg:w-[22px]" />{' '}
              Add To Quotation
            </Button>
            <WishlistButton />
          </div>
          <div className="mt-10 flex flex-row font-medium">
            <span className="text-lg">Quantity : </span>
            <input
              defaultValue={1}
              value={formValues?.quantity}
              onChange={updateValues}
              name="quantity"
              type="number"
              className="mx-1 rounded p-1"
              required
            />
          </div>
          <div className="mt-10 font-medium">
            <textarea
              value={formValues?.requirements}
              name="requirements"
              className="mx-1 w-full rounded p-1"
              onChange={updateValues}
              placeholder="Requirements"
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
