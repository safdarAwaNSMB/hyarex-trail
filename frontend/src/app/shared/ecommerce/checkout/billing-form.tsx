import React, { useState } from 'react';
import { Input, Title, Radio, Button } from 'rizzui';
import { PhoneNumber } from '@/components/ui/phone-input';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

export default function BillingForm({ quotation }: any) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyName: '',
    addressOne: '',
    addressTwo: '',
    city: '',
    country: '',
    zip: '',
    state: '',
    isSameShippingAddress: 'SameShippingAddress',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    addressOne: '',
    addressTwo: '',
    city: '',
    country: '',
    zip: '',
    state: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoneNumberChange = (value: string) => {
    setFormData({
      ...formData,
      phoneNumber: value,
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isSameShippingAddress: e.target.value,
    });
  };

  const makePayment = async () => {
    const stripe = await loadStripe(
      'pk_test_51PNItb2NSA72NfBmF9gytCMva5aUh0c1imjeYZb8jq50uqI510nptlQvGpl0aLrsB6zvAdxsgEWr2eIn01QG890S006bKdMtXD'
    );
    const body = {
      quotation,
    };
    const response: any = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-payment`,
      body
    );
    const result: any = stripe?.redirectToCheckout({
      sessionId: response.data.id,
    });
    if (result.error) {
      console.log(result.error);
    }
  };
  return (
    <>
      
 
        <Button onClick={makePayment} className='w-1/2 mx-auto' size="lg">Proceed to Checkout</Button>
 
    </>
  );
}
