'use client';

import { ActionIcon, Title, Button } from 'rizzui';
import { useDrawer } from '@/app/shared/drawer-views/use-drawer';
import RatingFilter from '@/app/shared/ecommerce/shop/shop-filters/rating-filter';
import PriceFilter from '@/app/shared/ecommerce/shop/shop-filters/price-filter';
import GenderSpecificFilter from '@/app/shared/ecommerce/shop/shop-filters/gender-specific-filter';
import { useFilterControls } from '@/hooks/use-filter-control';
import {
  initialState,
  categoriesData,
  genderData,
  guaranteeData,
  twoFourHoursShipmentRate,
  fourEightHoursShipmentRate,
  scoreData,
} from '@/app/shared/ecommerce/shop/shop-filters/filter-utils';
import FilterWithSearch from '@/components/filter-with-search';
import { PiXBold } from 'react-icons/pi';
import hasSearchedParams from '@/utils/has-searched-params';
import { useAtom, useAtomValue } from 'jotai';
import { filtersData, loadingProducts, products, searchedText } from '@/store/atoms';
import axios from 'axios';

export default function ShopFilters() {
  const { state, applyFilter, clearFilter, reset } = useFilterControls<
    typeof initialState,
    any
  >(initialState);
  const searchCharacter = useAtomValue(searchedText);
  const [filters, setFilters] = useAtom(filtersData);
  const [isLoading, setLoading] = useAtom(loadingProducts);
  const [ProductsToShow, setProductsToShow] = useAtom(products);

  const options = {
    method: 'GET',
    url: `https://www.lovbuy.com/1688api/searchproduct.php?key=${process.env.NEXT_PUBLIC_API_KEY}&lang=en&page=1&key_word=${filters.gender ? (filters.gender + " " + searchCharacter + " " + filters.category && filters.category) : filters.category ? filters.category + " " + searchCharacter : searchCharacter}&start_price=${filters.minPrice}&end_price=${filters.maxPrice}&key_word=${filters.shipping}`,
    // params: {
    //   query: filters.gender ? (filters.gender + " " + searchCharacter + " " + filters.category && filters.category) : filters.category ? filters.category + " " + searchCharacter : searchCharacter,
    //   inStock: true,
    //   // page: currentPage + 1,
    //   query_language: 'en',
    //   target_language: 'zt',
    //   minPrice: filters.minPrice,
    //   maxPrice: filters.maxPrice
    // },
    // headers: {
    //   'X-RapidAPI-Key': '1013c5ec66msh372a762a07eeb8fp1803b5jsna65e28c27f18',
    //   'X-RapidAPI-Host': 'alibaba-1688-data-service.p.rapidapi.com'
    // }
  };

  const getProducts = async () => {
    try {
      console.log(searchCharacter);

      const dataToPost = JSON.stringify({
        "key": `${process.env.NEXT_PUBLIC_API_KEY}`,
        "beginPage": `1`,
        "pageSize": "30",
        "keyword": `${searchCharacter}`,
        "priceStart": `${filters.minPrice}`,
        "priceEnd": `${filters.maxPrice}`,
        "language": `en`,
        "filter": [
          filters.guarantee,
          filters.twoFourHoursShipmentRate,
          filters.fourEightHoursShipmentRate,
          filters.score,
          filters.certifiedFactory,
        ].filter(value => value !== null && value !== undefined).join(',')
      });
      console.log(dataToPost);

      setLoading(true)
      const response = await axios.post('https://www.lovbuy.com/1688api/searchproduct2.php', dataToPost).catch(err => console.log(err)
      );
      // // setReqRes(response.data)
      console.log(response);
     console.log(response?.data?.result?.result?.data);
      // closeDrawer();
      setProductsToShow(response?.data?.result?.result?.data);
      setLoading(false)
      // setMoreLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  const { closeDrawer } = useDrawer();

  return (
    <>
      <div className="flex items-center justify-between border-b border-muted px-5 py-3.5">
        <Title as="h5" className="font-semibold">
          Filters
        </Title>
        <ActionIcon
          variant="outline"
          onClick={() => closeDrawer()}
          className="border-0 p-0"
        >
          <PiXBold className="h-auto w-5" />
        </ActionIcon>
      </div>

      <div className="custom-scrollbar h-[calc(100vh-136px)] space-y-9 overflow-y-auto px-5 py-6">
        {/* <GenderSpecificFilter state={state} applyFilter={applyFilter} /> */}
        {/* <FilterWithSearch
          title="Items For"
          name="gender"
          data={genderData}
          state={state}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
        />
        <FilterWithSearch
          title="Category"
          name="category"
          data={categoriesData}
          state={state}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
        /> */}
        <FilterWithSearch
          title="Guarantee"
          name="guarantee"
          data={guaranteeData}
          state={state}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
        />
        <FilterWithSearch
          title="24 Hour Shipment Rate"
          name="twoFourHoursShipmentRate"
          data={twoFourHoursShipmentRate}
          state={state}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
        />
        <FilterWithSearch
          title="48 Hour Shipment Rate"
          name="fourEightHoursShipmentRate"
          data={fourEightHoursShipmentRate}
          state={state}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
        />
        <FilterWithSearch
          title="Score"
          name="score"
          data={scoreData}
          state={state}
          applyFilter={applyFilter}
          clearFilter={clearFilter}
        />
        <div>
          <input className='mx-2' type='checkbox' onChange={(e) => {
            setFilters({ ...filters, certifiedFactory: e.target.checked })
          }} />
          Cerified Factory
        </div>
        <PriceFilter state={state} applyFilter={applyFilter} />
        {/* <RatingFilter state={state} applyFilter={applyFilter} /> */}
      </div>

      <div className="flex h-16 flex-shrink-0 items-center justify-center gap-3 bg-white px-5 py-3 dark:bg-gray-100">
        {filters.category || filters.gender || filters.score || filters.fourEightHoursShipmentRate || filters.twoFourHoursShipmentRate || filters.guarantee || filters.minPrice !== 0 || filters?.maxPrice !== 10000 ? (
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => {
              setFilters({ category: null, gender: null, score: null, fourEightHoursShipmentRate: null, twoFourHoursShipmentRate: null, guarantee: null, minPrice: 0, maxPrice: 10000 })
              closeDrawer();
            }}
          >
            Reset All
          </Button>
        ) : null}
        <Button size="lg" onClick={() => {
          getProducts();
        }} className="w-full">
          Show results
        </Button>
      </div>
    </>
  );
}
