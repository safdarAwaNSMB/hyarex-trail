import Link from 'next/link';
import { routes } from '@/config/routes';
import { Button, Title } from 'rizzui';
import ProductModernCard from '@/components/cards/product-modern-card';
import { similarProducts } from '@/data/similar-products-data';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAtom, useAtomValue } from 'jotai';
import { filtersData, pageNumber, productToShow, searchedText} from '@/store/atoms';

export default function ProductDetailsRelatedProducts() {

  const [productsToShow, setProductsToShow] = useState<any[]>([])
  const [reqRes, setReqRes] = useState(null)
  const [moreLoading, setMoreLoading] = useState(false);
  const [currentPage, setCurrentPage] = useAtom(pageNumber);
  const [searchCharacter, setSearchCharacter] = useAtom(searchedText);
  const product = useAtomValue(productToShow);
  const filterValues = useAtomValue(filtersData);
  const searched = useAtomValue(searchedText);
  const options = {
    method: 'GET',
    url: `https://www.lovbuy.com/1688api/searchproduct.php?key=${process.env.NEXT_PUBLIC_API_KEY}&lang=en&page=${currentPage + 1}&start_price=${filterValues.minPrice}&end_price=${filterValues?.maxPrice}&&key_word=${filterValues.gender ? (filterValues.gender + " " + searchCharacter + " " + filterValues.category && filterValues.category) : filterValues.category ? filterValues.category + " " + searchCharacter : searchCharacter}&catalog_id=${product.categoryId}`,
    // params: {
    //   query: searchCharacter,
    //   inStock: 'true',
    //   page : currentPage + 1
    // },
    // headers: {
    //   'X-RapidAPI-Key': '1013c5ec66msh372a762a07eeb8fp1803b5jsna65e28c27f18',
    //   'X-RapidAPI-Host': 'alibaba-1688-data-service.p.rapidapi.com'
    // }
  };

  const getProducts = async ()=>{
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setReqRes(response.data)
      setProductsToShow(response?.data?.items?.item);
      // setCurrentPage(response.data.page);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
