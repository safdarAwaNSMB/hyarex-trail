
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { PiXBold } from 'react-icons/pi';
import {
  Title,
  Text,
  Textarea,
  Button,
  Select,
  Avatar,
  NumberInput,
  Input,
} from 'rizzui';

export default function ExpandedOrderRow({
  record,
  agents,
  reloadFunction,
}: any) {
  const session: any = useSession();
  const [agentNotes, setAgentNotes] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);
  useEffect(() => {
    setProducts(record?.products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const router = useRouter()
  if (record?.products?.length === 0) {
    return <Text>No product available</Text>;
  }
  const approveQuotation = async () => {
    try {
      if (selectedAgent === null) {
        toast.error('Please select Agent before Approval!');
      } else {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/approve-quotation/${record.id}`,
            { selectedAgent, agentNotes }
          )
          .then((res) => {
            toast.success('Quotation has been Approved and sended to Agent!');
            reloadFunction();
          })
          .catch((err) => {
            toast.error('Sorry, error!');
          })
          .finally(() => {
            setSelectedAgent(null), setAgentNotes('');
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptQuotation = async () => {
    try {
      
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/accept-quotation/${record.id}`
          )
          .then((res) => {
            toast.success('Quotation has been Accepted!');
            router.push('/quotations/' + record.id)
          })
          .catch((err) => {
            toast.error('Sorry, error!');
          })
          .finally(() => {
            setSelectedAgent(null), setAgentNotes('');
          });
      
    } catch (error) {
      console.log(error);
    }
  };

  const buyerChangeRequest = async () => {
    try {
      
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/buyer-change-request/${record.id}`
          )
          .then((res) => {
            toast.success('Change Request Sended!');
            reloadFunction();
          })
          .catch((err) => {
            toast.error('Sorry, error!');
          })
          .finally(() => {
            setSelectedAgent(null), setAgentNotes('');
          });
      
    } catch (error) {
      console.log(error);
    }
  };

  const adminChangeRequest = async () => {
    try {
      
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin-change-request/${record.id}`
          )
          .then((res) => {
            toast.success('Change Request Sended!');
            reloadFunction();
          })
          .catch((err) => {
            toast.error('Sorry, error!');
          })
          .finally(() => {
            setSelectedAgent(null), setAgentNotes('');
          });
      
    } catch (error) {
      console.log(error);
    }
  };
  const denyQuotation = async () => {
    try {
      
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/deny-quotation/${record.id}`
          )
          .then((res) => {
            toast.success('Quotation has been Denied!');
            reloadFunction();
          })
          .catch((err) => {
            toast.error('Sorry, error!');
          })
          .finally(() => {
            setSelectedAgent(null), setAgentNotes('');
          });
      
    } catch (error) {
      console.log(error);
    }
  };

  const applyCommision = async () => {
    try {
      const notFilled = products?.find(
        (product: any) =>
          product.adminCommision === null ||
          product.adminCommision === '' ||
          product.adminCommision === undefined
      );
      if (notFilled) {
        toast.error('Please Provide commision Percentage for all products!');
      } else {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/apply-commisions/${record.id}`,
            { products }
          )
          .then((res) => {
            toast.success('Commsion has been added and sended to Buyer!');
            reloadFunction();
          })
          .catch((err) => {
            toast.error('Sorry, error!');
          })
          .finally(() => {
            setSelectedAgent(null), setAgentNotes('');
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateProducts = (index: number, quotedPrice: number | string) => {
    setProducts((prevProducts: any) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = { ...updatedProducts[index], quotedPrice };
      return updatedProducts;
    });
  };
  const addCommision = (index: number, commisionValue: number | string) => {
    setProducts((prevProducts: any) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        adminCommision: commisionValue,
      };
      return updatedProducts;
    });
  };

  const offerQuotation = async () => {
    try {
      const notFilled = products?.find(
        (product: any) =>
          product.quotedPrice === null ||
          product.quotedPrice === '' ||
          product.quotedPrice === undefined
      );
      if (notFilled) {
        toast.error('Please Provide quoted Price for all products!');
      } else {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/offer-quotation/${record.id}`,
            { products }
          )
          .then((res) => {
            toast.success('Quotation has been Offered and sended to Admin!');
            reloadFunction();
          })
          .catch((err) => {
            toast.error('Sorry, error!');
          })
          .finally(() => {
            setSelectedAgent(null), setAgentNotes('');
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rejectQuotation = async () => {
    try {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/reject-quotation/${record.id}`
        )
        .then((res) => {
          toast.success('Quotation has been Rejcted!');
          reloadFunction();
        })
        .catch((err) => {
          console.log(err);

          toast.error('Sorry, error!');
        })
        .finally(() => {
          setSelectedAgent(null), setAgentNotes('');
        });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(record);

  return (
    <div className="grid grid-cols-1 divide-y bg-gray-0 px-3.5 dark:bg-gray-50">
      {products?.map((product: any, index: number) => (
        <>
          <article
            key={product.productData?.offerId}
            className="flex w-full items-center justify-between gap-3 py-6 first-of-type:pt-2.5 last-of-type:pb-2.5"
          >
            <div className="flex w-1/3 items-start justify-start">
              <div className="relative me-4 aspect-[80/60] w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                <Image
                  fill
                  className=" object-cover"
                  src={product.productData?.productImage.images[0]}
                  alt="Product image"
                />
              </div>
              <header>
                <Title as="h4" className="mb-0.5 w-full text-sm font-medium">
                  {product.productData?.subjectTrans}
                </Title>
                <Text className="text-xs text-gray-500">
                  {
                    product?.productData?.productSaleInfo.priceRangeList[0]
                      .startQuantity
                  }{' '}
                  Unit Price: $
                  {
                    product?.productData?.productSaleInfo.priceRangeList[0]
                      .price
                  }
                </Text>
              </header>
            </div>
            <div className="flex w-2/3  items-center justify-between gap-4">
              <div className="flex items-center">
                <PiXBold size={13} className="me-1 text-gray-500" />{' '}
                <Text
                  as="span"
                  className="font-medium text-gray-900 dark:text-gray-700"
                >
                  {product.quantity}
                </Text>
              </div>
              <Text className="font-medium text-gray-900 dark:text-gray-700">
                Total : $
                {Number(product.quantity) *
                  Number(
                    product?.productData?.productSaleInfo.priceRangeList[0]
                      .price /
                      product?.productData?.productSaleInfo.priceRangeList[0]
                        .startQuantity
                  )}
              </Text>
              {session.data?.userData?.userrole === 'agent' && (
                <div className="w-full max-w-xs ps-4 md:w-1/2">
                  <Text className="font-medium text-gray-900 dark:text-gray-700">
                    Quoted Price ($) :
                    <NumberInput
                      aria-label="Quoted Price"
                      formatType="numeric"
                      placeholder="Price"
                      value={product?.quotedPrice}
                      onChange={(e) => {
                        updateProducts(index, e.target.value);
                      }}
                      customInput={Input as React.ComponentType<unknown>}
                    />
                  </Text>
                </div>
              )}{' '}
              {session.data?.userData?.userrole === 'admin' &&
                product.quotedPrice !== null && (
                  <div className="w-full max-w-xs ps-4 md:w-1/2">
                    <Text className="font-medium text-gray-900 dark:text-gray-700">
                      Quoted Price : {product.quotedPrice}
                    </Text>
                  </div>
                )}
              {(session.data?.userData?.userrole === 'buyer' &&
                product.quotedPrice !== null && record.commisionapplied === true) && (
                  <div className="w-full max-w-xs ps-4 md:w-1/2">
                    <Text className="font-medium text-gray-900 dark:text-gray-700">
                      Quoted Price : {Number(product.quotedPrice) + Number((product.quotedPrice/100) * product.adminCommision)}$
                    </Text>
                  </div>
                )}
              {session.data?.userData?.userrole === 'admin' &&
                record.status === 'Quoted' && (
                  <div className="w-full max-w-xs ps-4 md:w-1/2">
                    <Text className="font-medium text-gray-900 dark:text-gray-700">
                      Admin Commision (%) :
                      <NumberInput
                        aria-label="Commision Percentage"
                        formatType="numeric"
                        placeholder="Commision Percentage"
                        value={product?.adminCommision}
                        onChange={(e) => {
                          addCommision(index, e.target.value);
                        }}
                        customInput={Input as React.ComponentType<unknown>}
                      />
                    </Text>
                  </div>
                )}
            </div>
          </article>
          <div className=" mb-7 flex flex-row gap-3">
            <Title as="h4" className="mb-0.5 truncate text-sm font-medium">
              Requirements :
            </Title>
            <Text
              as="span"
              className="font-medium text-gray-900 dark:text-gray-700"
            >
              {product.requirements}
            </Text>
          </div>
        </>
      ))}

      {session.data?.userData?.userrole === 'admin' &&
        record?.status !== 'Quoted' && (
          <div className=" my-6 ">
            <div className="my-3 flex flex-row">
              <Select
                label="Select Agent"
                className=" mx-2 w-full md:w-1/2"
                options={agents.map((agent: any) => {
                  return {
                    label: agent?.firstname,
                    firstname: agent?.firstname,
                    value: agent?.email,
                    avator: agent?.firstname,
                  };
                })}
                value={selectedAgent}
                onChange={(value: any) => setSelectedAgent(value)}
                displayValue={(value) => renderDisplayValue(value)}
                getOptionDisplayValue={(option) =>
                  renderOptionDisplayValue(option)
                }
              ></Select>
              <Textarea
                label="Note for Agent :"
                placeholder="Notes about your order, e.g. special notes for delivery."
                size="sm"
                className="w-full md:w-1/2"
                onChange={(e) => {
                  setAgentNotes(e.target.value);
                }}
                textareaClassName="h-20"
              />
            </div>

            <div className=" my-3 flex flex-row justify-end gap-3">
              <Button onClick={rejectQuotation} variant="outline">
                Reject
              </Button>
              <Button onClick={approveQuotation}>Approve</Button>
            </div>
          </div>
        )}
      {session.data?.userData?.userrole === 'admin' &&
        record?.status === 'Quoted' && (
          <div className=" my-6 ">
            <div className=" my-3 flex flex-row justify-end gap-3">
              <Button variant='outline' onClick={adminChangeRequest}>Request Change</Button>
              <Button variant='outline' onClick={rejectQuotation}>Reject</Button>
              <Button onClick={applyCommision}>Apply Commisions</Button>
            </div>
          </div>
        )}
      {(session.data?.userData?.userrole === 'buyer' && record.status === 'Quoted' && record.commisionapplied === true) && (
          <div className=" my-6 ">
            <div className=" my-3 flex flex-row justify-end gap-3">
              <Button variant='outline' onClick={denyQuotation}>Deny Quotation</Button>
              <Button variant='outline' onClick={buyerChangeRequest}>Request Change</Button>
              <Button onClick={acceptQuotation}>Accept Quotation</Button>
            </div>
          </div>
        )}
      {(session.data?.userData?.userrole === 'buyer' && record.status === 'Accepted' && record.commisionapplied === true) && (
          <div className=" my-6 ">
            <div className=" my-3 flex flex-row justify-end gap-3">
              <Button onClick={()=>{
                router.push('/quotations/' + record.id)
              }}>Pay Quotation</Button>
            </div>
          </div>
        )}
      {session.data?.userData?.userrole === 'agent' && record.agentnotes && (
        <div className=" my-6 ">
          <Title as="h4" className="mb-0.5 truncate text-sm font-medium">
            Note for Agent :
          </Title>
          <Text
            as="span"
            className="font-medium text-gray-900 dark:text-gray-700"
          >
            {record.agentnotes}
          </Text>
          <div className=" my-3 flex flex-row justify-end gap-3">
            <Button onClick={offerQuotation}>Offer Quotation</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function renderDisplayValue(option: any) {
  console.log(option);

  return (
    <span className="flex items-center gap-2">
      <Avatar
        src={option?.avatar}
        name={option?.label}
        className="h-3 w-3 rounded-full object-cover"
      />
      <Text>{option?.label}</Text>
    </span>
  );
}

function renderOptionDisplayValue(option: any) {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={option.avatar}
        name={option.label}
        className="h-9 w-9 rounded object-cover"
      />
      <div>
        <Text fontWeight="medium">{option.label}</Text>
        <Text>{option.value}</Text>
      </div>
    </div>
  );
}
