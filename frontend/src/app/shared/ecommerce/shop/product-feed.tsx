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
import { useAtom, useAtomValue } from 'jotai';
import { filtersData, imageUrl, loadingProducts, pageNumber, products, searchedText } from '@/store/atoms';

function generateRandomCharacter(): string {
  // Random number between 0 and 51 representing characters from a-z and A-Z
  const randomIndex = Math.floor(Math.random() * 52);

  // Determine if uppercase or lowercase
  const isUppercase = randomIndex < 26; // Lowercase: 0-25, Uppercase: 26-51

  const charCode = isUppercase ? randomIndex + 65 : randomIndex + 97; // Convert to ASCII code

  return String.fromCharCode(charCode); // Convert ASCII code to single character
}

export default function ProductFeed() {
  const [isLoading, setLoading] = useAtom(loadingProducts);
  const [productsToShow, setProductsToShow] = useAtom(products)
  const [currentPage, setCurrentPage] = useAtom(pageNumber);
  const [moreLoading, setMoreLoading] = useState(false)
  const [searchCharacter, setSearchCharacter] = useAtom(searchedText);
  const filterValues = useAtomValue(filtersData);
  const imageLink = useAtomValue(imageUrl)
  const options = {
    method: 'GET',
    url: `https://www.lovbuy.com/1688api/searchproduct.php?key=${process.env.NEXT_PUBLIC_API_KEY}&lang=en&page=${currentPage + 1}&start_price=${filterValues.minPrice}&end_price=${filterValues?.maxPrice}&key_word=${filterValues.gender ? (filterValues.gender + " " + searchCharacter + " " + filterValues.category && filterValues.category) : filterValues.category ? filterValues.category + " " + searchCharacter : searchCharacter}`,
  };
  // const optionsForImageSearch = {
  //   method: 'GET',
  //   url: 'https://alibaba-1688-data-service.p.rapidapi.com/search/searchByImage',
  //   params: {
  //     imageUrl: imageLink,
  //     page: currentPage + 1
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': '1013c5ec66msh372a762a07eeb8fp1803b5jsna65e28c27f18',
  //     'X-RapidAPI-Host': 'alibaba-1688-data-service.p.rapidapi.com'
  //   }
  // };


  const getProducts = async () => {
    try {
      console.log(searchCharacter);

      const response = await axios.request(options).finally(() => setLoading(false));
      console.log(response);
      console.log(response?.data?.items?.item?.length);
      if (Array.isArray(response?.data?.items?.item) && response?.data?.items?.item?.length === 0) {
        getProductsByAgainCharacter(generateRandomCharacter());
      } else if(Array.isArray(response?.data?.items?.item)) {
        setProductsToShow([...productsToShow, ...response?.data?.items?.item]);
        setCurrentPage(response.data.items.page);
        setMoreLoading(false)
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const getProductsByAgainCharacter = async (character: any) => {
    try {
      console.log(character);
      setSearchCharacter(character);
      const response = await axios.request({
        method: 'GET',
        url: `https://www.lovbuy.com/1688api/searchproduct.php?key=${process.env.NEXT_PUBLIC_API_KEY}&lang=en&page=${currentPage + 1}&start_price=${filterValues.minPrice}&end_price=${filterValues?.maxPrice}&key_word=${character}`,
      }).finally(() => setLoading(false));
      console.log(response);
      console.log(response?.data?.items?.item?.length);

      if (response?.data?.items?.item?.length === 0 || response?.data?.status === 510) {
        setSearchCharacter(generateRandomCharacter());
        getProductsByAgainCharacter(generateRandomCharacter());
      } else {
        setProductsToShow([...productsToShow, ...response?.data?.items?.item]);
        setCurrentPage(response.data.items.page);
        setMoreLoading(false)
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (productsToShow?.length === 0) {
      setSearchCharacter(generateRandomCharacter());
      getProducts();
      return
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    if (productsToShow?.length < 1) {
      setSearchCharacter(generateRandomCharacter());
      getProducts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLoadMore() {
    setMoreLoading(true);
    getProducts();
  }


  return (
    <div className="@container">
      {isLoading ? (
        <div className='flex justify-center'>
          <div className='spinner'></div>
        </div>
      ) : (
        <>
          {productsToShow?.length < 1 ? (
            <p className=' text-center w-full mx-auto'>Sorry, Try Again!</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-6 @md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] @xl:gap-x-7 @xl:gap-y-9 @4xl:grid-cols-[repeat(auto-fill,minmax(289px,1fr))] @6xl:grid-cols-[repeat(auto-fill,minmax(289px,1fr))]">
              {productsToShow?.map((product: any, index: number) => (
                <ProductModernCard key={product.offerId} product={product} />
              ))}
            </div>
          )}
          <div className="mb-4 mt-5 flex flex-col items-center xs:pt-6 sm:pt-8">
            <Button isLoading={moreLoading} onClick={() => handleLoadMore()}>
              Load More
            </Button>
          </div>
        </>
      )}


    </div>
  );
}
