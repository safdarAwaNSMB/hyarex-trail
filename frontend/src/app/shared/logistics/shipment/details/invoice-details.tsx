import { formatDate } from '@/utils/format-date';
import { Badge } from 'rizzui';

const data = [
  {
    Agency: 'Deprixa Miami',
    Office: 'Miami - Florida',
    'Logistics Service': 'Ocean Freight',
  },
  {
    'Invoice date': 'Jun 15, 2023',
    'Package Type': 'Flat small box',
    'Courier Company': 'Cargus',
  },
  {
    'Delivery time': 'TNT 10-14 DAYS',
    'Payment Method': 'Cash on delivery',
    'Shipping Mode': 'Next Day',
  },
];

export default function InvoiceDetails({quotation } : any) {
  
  return (
    <div className="grid items-start rounded-xl border border-gray-300 p-5 @2xl:grid-cols-2 @3xl:grid-cols-3 @3xl:p-8 @5xl:grid-cols-4">
      <ul className="grid gap-3 @3xl:col-span-full @3xl:mb-2 @5xl:col-span-1 @5xl:mb-0">
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Quotation ID :</span>
          <span className="text-base font-semibold text-gray-900">
            #{quotation?.id}
          </span>
        </li>
        <li className="flex items-center gap-3 @3xl:justify-between @5xl:justify-start">
          <span className="font-semibold text-gray-900">Quotation Status :</span>
          <Badge color='secondary' rounded="md">
            {quotation?.status}
          </Badge>
        </li>
      </ul>
  
        <ul  className="mt-3 grid gap-3 @5xl:mt-0">
          
            <li className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">Creation Date :</span>
              <span>{formatDate(quotation.quotationdate, "DD-MM-YYYY")}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">Type :</span>
              <span>{quotation.type}</span>
            </li>
        
        </ul>
        <ul  className="mt-3 grid gap-3 @5xl:mt-0">
          
            <li className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">Customer Name :</span>
              <span>{quotation.customer.name}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">Custometr Email :</span>
              <span>{quotation.customer.email}</span>
            </li>
        
        </ul>
        <ul  className="mt-3 grid gap-3 @5xl:mt-0">
          
            <li className="flex items-center gap-3">
              <span className="font-semibold text-gray-900">Total Items :</span>
              <span>{quotation.products?.length}</span>
            </li>
            
        
        </ul>
     
    </div>
  );
}
