'use client';

import { useEffect, useState } from 'react';
import { Button } from 'rizzui';
import ProductModernCard from '@/components/cards/product-modern-card';
import { modernProductsGrid } from '@/data/shop-products';
import hasSearchedParams from '@/utils/has-searched-params';
// Note: using shuffle to simulate the filter effect
import shuffle from 'lodash/shuffle';
import axios from 'axios';
import { set } from 'lodash';

function generateRandomCharacter(): string | number {
  // Random number between 0 and 61 representing characters from 0-9, a-z, and A-Z
  const randomIndex = Math.floor(Math.random() * 62);

  // Determine if an alphabet or number should be generated
  const isNumber = randomIndex < 10; // 0-9 have indices 0-9

  if (isNumber) {
    return String.fromCharCode(randomIndex + 48); // Convert number to single character
  } else {
    // Shift indices for alphabets:
    // - Lowercase: start at 10 (index 10-35)
    // - Uppercase: start at 36 (index 36-61)
    const shiftedIndex = isNumber ? randomIndex - 10 : randomIndex - 36;
    const charCode = isNumber ? shiftedIndex + 48 : shiftedIndex + 65; // Convert to ASCII code
    return String.fromCharCode(charCode); // Convert ASCII code to single character
  }
}

export default function ProductFeed() {
  const [isLoading, setLoading] = useState(false);
  const [productsToShow, setProductsToShow] = useState<any[]>([])
  const [reqRes, setReqRes] = useState(null)
  const [currentPage, setCurrentPage] = useState(0);
  const [moreLoading, setMoreLoading] = useState(false)
  const [searchCharacter, setSearchCharacter] = useState<string | number>(generateRandomCharacter())

  

  const options = {
    method: 'GET',
    url: 'https://alibaba-1688-data-service.p.rapidapi.com/search/searchItems',
    params: {
      query: searchCharacter,
      inStock: 'true',
      page : currentPage + 1
    },
    headers: {
      'X-RapidAPI-Key': '1013c5ec66msh372a762a07eeb8fp1803b5jsna65e28c27f18',
      'X-RapidAPI-Host': 'alibaba-1688-data-service.p.rapidapi.com'
    }
  };

  const getProducts = async ()=>{
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setReqRes(response.data)
      
      setProductsToShow([...productsToShow, ...response.data.items]);
      setCurrentPage(response.data.page);
      setMoreLoading(false)
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(()=>{
    if(productsToShow?.length < 10){
      setSearchCharacter(generateRandomCharacter());
      getProducts();
    }
  }, [productsToShow])
  // const getMoreProducts = async ()=>{
  //   try {
  //     const response = await axios.request(options);
  //     console.log(response.data);
  //     setReqRes(response.data);
  //     const updatedProducts = [...productsToShow]
  //     setProductsToShow(response.data.items);
  //     setCurrentPage(response.data.page);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  
  useEffect(()=>{
    getProducts();
  }, [])

  function handleLoadMore() {
    setMoreLoading(true);
    getProducts();
  }


  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 @md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] @xl:gap-x-7 @xl:gap-y-9 @4xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] @6xl:grid-cols-[repeat(auto-fill,minmax(364px,1fr))]">
        {productsToShow?.map((product : any, index : number) => (
            <ProductModernCard key={product.id} product={product} />
          ))}
      </div>

      
        <div className="mb-4 mt-5 flex flex-col items-center xs:pt-6 sm:pt-8">
          <Button isLoading={moreLoading} onClick={() => handleLoadMore()}>
            Load More
          </Button>
        </div>
     
    </div>
  );
}
