import Link from 'next/link';
import { routes } from '@/config/routes';
import { Button, Title } from 'rizzui';
import ProductModernCard from '@/components/cards/product-modern-card';
import { similarProducts } from '@/data/similar-products-data';
import { useEffect, useState } from 'react';
import axios from 'axios';
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
export default function ProductDetailsRelatedProducts(product : any) {

  const [productsToShow, setProductsToShow] = useState<any[]>([])
  const [reqRes, setReqRes] = useState(null)
  const [currentPage, setCurrentPage] = useState(0);
  const [moreLoading, setMoreLoading] = useState(false);
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
    <section className="pt-10 @5xl:pt-12 @7xl:pt-14">
      <header className="mb-4 flex items-center justify-between">
        <Title as="h3" className="font-semibold">
          More Products
        </Title>
        <Link href='/'>
          <Button as="span" variant="text" className="py-0 underline">
            See All
          </Button>
        </Link>
      </header>
      <div className="grid grid-cols-1 gap-x-5 gap-y-6 @md:grid-cols-2 @xl:grid-cols-3 @xl:gap-y-9 @5xl:grid-cols-4 @5xl:gap-x-7 @7xl:grid-cols-5">
        {productsToShow?.map((product) => (
          <ProductModernCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
