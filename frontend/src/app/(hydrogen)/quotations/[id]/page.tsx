'use client';

import { Button, Loader } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import InvoiceDetails from '@/app/shared/logistics/shipment/details/invoice-details';
import { useEffect, useState } from 'react';
import { getSingleQuotation } from '@/data/order-data';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DeliveryDetails from '@/app/shared/logistics/shipment/details/delivery-details';
import PaymentMethod from '@/app/shared/ecommerce/checkout/payment-method';
import BillingForm from '@/app/shared/ecommerce/checkout/billing-form';

export default function QuotationDetailsPage() {
  const pageHeader = {
    title: `Quotation Details`,
    breadcrumb: [],
  };

  const [loading, setLoading] = useState(true);
  const [quotationData, setQuotationData] = useState(null);
  const session: any = useSession();
  const params: any = useParams();

  const getData = async () => {
    try {
      const resultData = await getSingleQuotation(params.id);
      console.log(resultData[0]);
      setQuotationData(resultData)
      if (session.data?.userData?.userrole === 'buyer') {
        if (resultData[0]?.customer?.email === session.data?.userData?.email) {
          setQuotationData(resultData);
        }
      } else {
        setQuotationData(resultData);
      }
    } catch (error) {
      console.error('Error fetching quotation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, session.data]);
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader variant="spinner" size="xl" />
        </div>
      ) : (
        <>
          {quotationData ? (
            <div className="mt-2 flex flex-col gap-y-6 @container sm:gap-y-10">
              <InvoiceDetails quotation={quotationData[0]} />
              <DeliveryDetails data={quotationData[0]} />
              <BillingForm quotation={quotationData[0]} />
            </div>
          ) : (
            <div>No Quotation Data Available</div>
          )}
        </>
      )}
    </>
  );
}
