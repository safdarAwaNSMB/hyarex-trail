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
  FileInput,
} from 'rizzui';
import {
  PiFileTextDuotone,
  PiMagnifyingGlassBold,
  PiXBold,
} from 'react-icons/pi';
import { pageLinks } from '@/components/search/page-links.data';
import axios from 'axios';
import { useAtom } from 'jotai';
import { filtersData, imageUrl, loadingProducts, pageNumber, products, searchedText } from '@/store/atoms';
import toast from 'react-hot-toast';

export default function SearchImage({ onClose, setOpen, className }: { setOpen?: any, onClose?: () => void, className?: string }) {
  const inputRef = useRef<any>(null);
  const [filetrs, setFilters] = useAtom(filtersData);
  const [productsToShow, setProductsToShow] = useAtom(products);
  const [imageToSearch, setImageToSearch] = useState(null)
  const [currentPage, setCurrentPage] = useAtom(pageNumber);
  const [isLoading, setLoading] = useAtom(loadingProducts)

  function getBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = function () {
        const base64Data = reader.result as string;
        const dataWithoutPrefix = base64Data.split(',')[1]; // Get everything after the comma
        resolve(dataWithoutPrefix);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }


  const searchProducts = async () => {
    try {
      setLoading(true)
      const imageData = await getBase64(imageToSearch);
      const postData: any = {
        key: `${process.env.NEXT_PUBLIC_API_KEY}`,
        data: `${imageData}`
      }
      setOpen(false)
      const imageResponse: any = await axios.post("https://www.lovbuy.com/1688api/uploadimg2.php", new URLSearchParams(postData)).catch(err => console.log(err))
      console.log(imageResponse);
      
      const dataToPost = JSON.stringify({
        "key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        "beginPage": `${currentPage + 1}`,
        "pageSize": "20",
        "imageId": `${imageResponse.data.result.result}`,
      });
      const response = await axios.post("https://www.lovbuy.com/1688api/searchimg2.php", dataToPost);
      setProductsToShow(response?.data?.result?.result?.data);
      setFilters({ category: null, gender: null, minPrice: 0, maxPrice: 10000 })
      setCurrentPage(response?.data?.result?.result?.currentPage);
      setLoading(false)
      // setMoreLoading(false)
    } catch (error) {
      console.error(error);
    }
  }


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
        <FileInput
          variant="flat"
          ref={inputRef}
          accept='.jpg, .png, .jpeg, .webp'
          onChange={(e: any) => setImageToSearch(e.target.files[0])}
          placeholder="Search pages here"
          className="flex-1"
        //   prefix={
        //     <PiMagnifyingGlassBold className="h-[18px] w-[18px] text-gray-600" />
        //   }

        />
        {imageToSearch && (
          <Button
            size="sm"
            // variant="text"
            className={cn(" ms-3 font-bold text-sm w-auto  px-2", className)}
            // style={{ margin: '-10px' }}
            onClick={async (e) => {
              e.preventDefault();
              if (imageToSearch) {
                searchProducts();
              } else {
                toast.error(<Text>Please Provide Image to Search</Text>)
              }
              // setOpen(false);
            }}
          >
            Search
          </Button>
        )}
        <ActionIcon
          variant="text"
          size="sm"
          className="ms-3 text-gray-500 hover:text-gray-700"
          onClick={() => {
            setImageToSearch(null)
            setOpen(false);
          }}
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
