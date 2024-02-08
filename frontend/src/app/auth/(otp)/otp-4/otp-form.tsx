'use client';

import { PinCode, Button } from 'rizzui';
import { Form } from '@/components/ui/form';
import { SubmitHandler } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type FormValues = {
  otp: string;
};

export default function OtpForm() {
  const pendingUser: string | undefined = Cookies.get('pendingUser');
  const parsedUser: any = pendingUser ? JSON.parse(pendingUser) : null;
  const [otpError, setOtpError] = useState(false);
  const router = useRouter();
  const [showPlans, setShowPlans] = useState(false)
  const verifiedUser: string | undefined = Cookies.get('verifiedUser');
  useEffect(() => {
    if (verifiedUser) {
      const parsedUser: any = verifiedUser ? JSON.parse(verifiedUser) : null;
      if (parsedUser?.userplan?.length === 0 || parsedUser?.userplan !== "null") {
        setShowPlans(true)
      }
    }
  }, [verifiedUser])

  // const resendOTP = async ()=>{
  //   try {


  //   await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-verification-Email`, { ...data, verificationcode }).then((res) => {
  //     console.log(res.data.data);
  //     Cookies.set('pendingUser', JSON.stringify(res.data.data), { expires: 1 });
  //     toast.success('Verification Email sent!');
  //     router.push('/auth/otp-4')
  //   }).catch(err => {
  //     toast.error('Error in sending mail, Try Again!')
  //   })
  // } catch (error) {

  // }
  // }

  const choosePlan = async (plan: string) => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assign-plan`, { ...parsedUser, userplan: plan }).then(res => {
      console.log(res);
      toast.success('Thanks For choosing Plan!');
      Cookies.remove('verifiedUser');
      setShowPlans(false)
      signIn('credentials', {
        ...res.data.user,
        callbackUrl: '/'
      })
    }).catch(err => {
      console.log(err);
    })
  }


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // console.log(data);
    console.log(parsedUser);

    if (data.otp?.length !== 5) {
      setOtpError(true);
    } else {
      if (data.otp === parsedUser?.verificationcode) {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/buyer-sign-up`, parsedUser).then(res => {
          toast.success('Your Account has been created!');
          Cookies.set('verifiedUser', JSON.stringify(parsedUser), { expires: 1 })
          Cookies.remove('pendingUser');
          setShowPlans(true)
          // signIn('credentials', {
          //   ...parsedUser,
          //   callbackUrl : '/'
          // })
        })
      } else {
        setOtpError(true);
        toast.error('Invalid OTP!')
      }
    }
  };
  return (
    <>
      <Form<FormValues> onSubmit={onSubmit}>
        {({ setValue }) => (
          <div className="space-y-5 lg:space-y-8">
            <PinCode
              length={5}
              variant="outline"
              setValue={(value) => setValue('otp', String(value))}
              className="pb-2"
              size="lg"
              error={otpError ? 'Invalid OTP' : ''}
            />

            <Button
              className="w-full text-base font-medium"
              type="button"
              // onClick={resentOtp}
              size="xl"
              variant="outline"
              rounded="lg"
            >
              Resend OTP
            </Button>
            <Button
              className="w-full text-base font-medium"
              type="submit"
              size="xl"
              rounded="lg"
            >
              Verify OTP
            </Button>
          </div>
        )}
      </Form>
      {showPlans && (
        <div className="overlay">
          <div className="card red-card">
            <h2>Simple</h2>
            <p>Some plan details here</p>
            <button onClick={() => choosePlan('free')} className="bg-red-500 text-white px-4 py-2 rounded">Choose Plan</button>
          </div>
          <div className="card orange-card">
            <h2>Average</h2>
            <p>Some plan details here</p>
            <button onClick={() => choosePlan('Average')} className="bg-orange-500 text-white px-4 py-2 rounded">Choose Plan</button>
          </div>
          <div className="card green-card">
            <h2>Premium</h2>
            <p>Some plan details here</p>
            <button onClick={() => choosePlan('Premium')} className="bg-green-500 text-white px-4 py-2 rounded">Choose Plan</button>
          </div>
        </div>
      )}
    </>
  );
}
