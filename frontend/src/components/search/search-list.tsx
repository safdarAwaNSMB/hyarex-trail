'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ActionIcon,
  Empty,
  SearchNotFoundIcon,
  Button,
  Title,
  Input,
  cn,
  Text,
} from 'rizzui';
import {
  PiFileTextDuotone,
  PiMagnifyingGlassBold,
  PiXBold,
} from 'react-icons/pi';
import { pageLinks } from '@/components/search/page-links.data';
import axios from 'axios';
import { useAtom } from 'jotai';
import { filtersData, loadingProducts, pageNumber, products, searchedText } from '@/store/atoms';
import toast from 'react-hot-toast';


export default function SearchList({ onClose, setOpen, className }: { setOpen?: any, onClose?: () => void, className?: string }) {
  const inputRef = useRef<any>(null);
  const [searchText, setSearchText] = useAtom(searchedText);
  const [isLoading, setLoading] = useAtom(loadingProducts);
  const [filetrs, setFilters] = useAtom(filtersData);
  const [englishSearch, setEnglishSearch] = useState("")
  const [productsToShow, setProductsToShow] = useAtom(products)
  const [currentPage, setCurrentPage] = useAtom(pageNumber);
  const options = {
    method: 'GET',
    url: `https://www.lovbuy.com/1688api/searchproduct.php?key=${process.env.NEXT_PUBLIC_API_KEY}&lang=en&page=${currentPage + 1}&key_word=${searchText}`,
    // params: {
    //   query: searchText,
    //   inStock: 'true',
    //   query_language: 'en',
    //   target_language: 'zt'
    // },
    // headers: {
    //   'X-RapidAPI-Key': '1013c5ec66msh372a762a07eeb8fp1803b5jsna65e28c27f18',
    //   'X-RapidAPI-Host': 'alibaba-1688-data-service.p.rapidapi.com'
    // }
  };
  // const optionsToTranslate = {
  //   method: 'POST',
  //   url: 'https://libretranslate.com/translate',
  //   body: JSON.stringify({
  //     q: searchText,
  //     source: "en",
  //     target: "zt",
  //     format: "text",
  //   }),
  //   headers: { "Content-Type": "application/json" }
  // };

  const searchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.request(options);
      console.log(response);
      console.log(searchText);
      if (response?.data?.items?.item?.length === 0) {
        searchProducts()
      } else {
        setProductsToShow(response.data?.items?.item);
        setFilters({ category: null, gender: null, minPrice: 0, maxPrice: 10000 })
        setCurrentPage(response.data?.items?.page);
        setLoading(false)
      }
      // setMoreLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  // let menuItemsFiltered = pageLinks;
  // if (searchText.length > 0) {
  //   menuItemsFiltered = pageLinks.filter((item: any) => {
  //     const label = item.name;
  //     return (
  //       label.match(searchText.toLowerCase()) ||
  //       (label.toLowerCase().match(searchText.toLowerCase()) && label)
  //     );
  //   });
  // }

  useEffect(() => {
    if (inputRef?.current) {
      // @ts-ignore
      inputRef.current.focus();
    }
    return () => {
      inputRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex items-center px-5 py-4">
        <Input
          variant="flat"
          ref={inputRef}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search pages here"
          className="flex-1"
          prefix={
            <PiMagnifyingGlassBold className="h-[18px] w-[18px] text-gray-600" />
          }
          suffix={
            searchText && (
              <>
                {/* <Button
                  size="sm"
                  variant="text"
                  className="h-auto w-auto px-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchText(() => '');
                  }}
                >
                  Clear
                </Button> */}
                <Button
                  size="sm"
                  // variant="text"
                  className={cn(" ms-3 font-bold text-sm w-auto  px-2", className)}
                  style={{ margin: '-10px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (inputRef.current?.value.length > 0) {
                      searchProducts();
                    } else {
                      toast.error(<Text>Please Enter Search Text</Text>)
                    }
                    setOpen(false);
                  }}
                >
                  Search
                </Button>
              </>
            )
          }
        />
        <ActionIcon
          variant="text"
          size="sm"
          className="ms-3 text-gray-500 hover:text-gray-700"
          onClick={() => setOpen(false)}
        >
          <PiXBold className="h-5 w-5" />
        </ActionIcon>
      </div>

      {/* <div className="custom-scrollbar max-h-[60vh] overflow-y-auto border-t border-gray-300 px-2 py-4">
        <>
          {menuItemsFiltered.length === 0 ? (
            <Empty
              className="scale-75"
              image={<SearchNotFoundIcon />}
              text="No Result Found"
              textClassName="text-xl"
            />
          ) : null}
        </>

        {menuItemsFiltered.map((item, index) => {
          return (
            <Fragment key={item.name + '-' + index}>
              {item?.href ? (
                <Link
                  href={item?.href as string}
                  className="relative my-0.5 flex items-center rounded-lg px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none focus-visible:bg-gray-100 dark:hover:bg-gray-50/50 dark:hover:backdrop-blur-lg"
                >
                  <span className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-500">
                    <PiFileTextDuotone className="h-5 w-5" />
                  </span>

                  <span className="ms-3 grid gap-0.5">
                    <span className="font-medium capitalize text-gray-900 dark:text-gray-700">
                      {item.name}
                    </span>
                    <span className="text-gray-500">
                      {item?.href as string}
                    </span>
                  </span>
                </Link>
              ) : (
                <Title
                  as="h6"
                  className={cn(
                    'mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-500',
                    index !== 0 && 'mt-6 4xl:mt-7'
                  )}
                >
                  {item.name}
                </Title>
              )}
            </Fragment>
          );
        })}
      </div> */}
    </>
  );
}
