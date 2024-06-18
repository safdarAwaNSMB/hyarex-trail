'use client';

import { useEffect, useState } from 'react';
import { Title } from 'rizzui';
import RangeSlider from '@/components/ui/range-slider';
import { useAtom } from 'jotai';
import { filtersData } from '@/store/atoms';

// Price rating component
export default function PriceFilter({
  state,
  applyFilter,
}: {
  state: any;
  applyFilter: (query: string, value: any) => void;
}) {

  const [filters, setFileters] = useAtom(filtersData);

  // useEffect(() => {
  //   if (state.price.length && typeof state.price === 'string') {
  //     const priceArr = state.price.split(',');

  //     setPrice({
  //       min: parseInt(priceArr[0]),
  //       max: parseInt(priceArr[1]),
  //     });
  //   }
  // }, [state.price]);

  function handleRangeChange(value: any) {
    setFileters({...filters, minPrice : value[0], maxPrice : value[1]})
  }
  // function handleMaxChange(max: number) {
  //   setPrice({
  //     ...price,
  //     max: max || price.min,
  //   });
  // }
  // function handleMinChange(min: number) {
  //   setPrice({
  //     ...price,
  //     min: min || 0,
  //   });
  // }

  return (
    <div className="block">
      <div className="">
        <Title as="h6" className="font-semibold">
          Price
        </Title>
        <div className="mb-3.5 flex items-center pt-5">
          <div className="flex items-center">
            $
            <input
              type="number"
              value={filters.minPrice}
              // onChange={(e) => handleMinChange(parseInt(e.target.value))}
              className="w-12 border-none bg-transparent p-0 text-sm outline-none focus:shadow-none focus:ring-0"
              // min={0}
              // max={filters.miPrice}
              readOnly
            />
          </div>
          -
          <div className="flex items-center ps-5">
            $
            <input
              type="number"
              value={filters.maxPrice}
              // onChange={(e) => handleMaxChange(parseInt(e.target.value))}
              className="border-none bg-transparent p-0 text-sm outline-none focus:shadow-none focus:ring-0"
              // min={price.min}
              readOnly
            />
          </div>
        </div>
        <RangeSlider
          range
          min={0}
          max={10000}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={(value: any) => {
            handleRangeChange(value);
            applyFilter('price', value);
          }}
        />
      </div>
    </div>
  );
}
