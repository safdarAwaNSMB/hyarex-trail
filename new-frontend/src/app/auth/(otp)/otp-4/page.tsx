'use client';

import AuthWrapperFour from '@/app/shared/auth-layout/auth-wrapper-four';
import { Text } from 'rizzui';
import OtpForm from '@/app/auth/(otp)/otp-4/otp-form';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function OtpPage() {
  const pendingUser: string | undefined = Cookies.get('pendingUser');
  const parsedUser: any = pendingUser ? JSON.parse(pendingUser) : null;
  const [userEmail, setUserEmail] = useState(null);
  useEffect(()=>{
    setUserEmail(parsedUser?.email)
  }, [parsedUser])
  return (
    <AuthWrapperFour title="OTP Verification" className="md:px-14 lg:px-20">
      <Text className="pb-7 text-center text-[15px] leading-[1.85] text-gray-700 md:text-base md:!leading-loose lg:-mt-5">
        OTP has been sent to <b><u>{userEmail}</u></b>
      </Text>
      <OtpForm />
    </AuthWrapperFour>
  );
}
