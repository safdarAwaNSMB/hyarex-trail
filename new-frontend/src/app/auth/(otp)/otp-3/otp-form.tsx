'use client';

import { Button, PinCode } from 'rizzui';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import Cookies from 'js-cookie';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

type FormValues = {
  otp: string;
};

export default function OtpForm() {
  
  const [otpError, setOtpError] = useState(false);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    
  };

  return (
    <Form<FormValues> onSubmit={onSubmit} className="w-full">
      {({ setValue }) => (
        <div className="space-y-5 lg:space-y-7">
          <PinCode
            length={5}
            variant="outline"
            setValue={(value) => setValue('otp', String(value))}
            size="lg"
            error={otpError ? 'Invalid OTP' : ''}
          />
          <div className="">
            <Button
              className="mt-4 w-full lg:mt-2"
              type="submit"
              size="xl"
              rounded="pill"
              variant="outline"
            >
              Resend OTP
            </Button>
          </div>
          <Button className="w-full" type="submit" size="xl" rounded="pill">
            Verify OTP
          </Button>
        </div>
      )}
    </Form>
  );
}
