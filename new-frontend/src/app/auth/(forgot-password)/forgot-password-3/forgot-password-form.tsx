'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { SubmitHandler } from 'react-hook-form';
import { routes } from '@/config/routes';
import { Input, Button, Text, Password, PinCode } from 'rizzui';
import { Form } from '@/components/ui/form';
import { useMedia } from '@/hooks/use-media';
import {
  forgetPasswordSchema,
  ForgetPasswordSchema,
} from '@/utils/validators/forget-password.schema';
import { ResetPasswordSchema, resetPasswordSchema } from '@/utils/validators/reset-password.schema';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const initialValues = {
  verificationCode: '',
  password: "",
  confirmpassword: ""
};

export default function ForgetPasswordForm() {
  const isMedium = useMedia('(max-width: 1200px)', false);
  const [reset, setReset] = useState({});
  const [loading, setLoading] = useState(false)
  const [otpError, setOtpError] = useState(false);
  const userToReset: string | undefined = Cookies.get('userToReset');
  const parsedUserToReset: any = userToReset ? JSON.parse(userToReset) : null;
  const router = useRouter()
  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
    if(!loading){
      
      if (data.verificationCode?.length !== 5) {
        setOtpError(true);
      } else {
        if (data.verificationCode === parsedUserToReset?.verificationcode) {
          setLoading(true)
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reset-password`, parsedUserToReset).then(res => {
            toast.success(
              <Text>
                Password Cahnges Successfully,
                Sign In with New Password!
              </Text>
            );
            Cookies.remove('userToReset');
            router.push('/')
            // setShowPlans(true)
            // signIn('credentials', {
            //   ...parsedUser,
            //   callbackUrl : '/'
            // })
          }).finally(() => setLoading(false))
        } else {
          setOtpError(true);
          toast.error('Invalid OTP!')
        }
      }
    }
  };

  return (
    <>
      <Form<ResetPasswordSchema>
        validationSchema={resetPasswordSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, setValue, formState: { errors } }) => (
          <div className="space-y-5 lg:space-y-6">
            <Text>We have sent a verification Code to your E-mail, please confirm it to reset Password!.</Text>
            <PinCode
              size={isMedium ? 'lg' : 'xl'}
              // label="Email"
              // className="[&>label>span]:font-medium"
              setValue={(value) => setValue('verificationCode', String(value))}
              length={5}
              error={errors.verificationCode?.message || otpError ? 'Invalid OTP' : ''}
            />
            <Password
              label="New Password"
              placeholder="Enter  password"
              size="lg"
              variant='flat'
              className="[&>label>span]:font-medium"
              {...register('password')}
              error={errors.password?.message}
            />
            <Password
              label="Confirm Password"
              placeholder="Confirm Password"
              size="lg"
              variant='flat'
              className="[&>label>span]:font-medium"
              {...register('confirmpassword')}
              error={errors.confirmpassword?.message}
            />
            <div className="block">
              <Button
                className="mt-1 w-full"
                type="submit"
                size={isMedium ? 'lg' : 'xl'}
              >
                {loading ? <div className='smallspinner'></div> : "Reset Password"}
              </Button>
            </div>
          </div>
        )}
      </Form>
      <Text className="mt-5 text-center text-[15px] leading-loose text-gray-500 md:mt-7 lg:mt-9 lg:text-base">
        Don’t want to reset?{' '}
        <Link
          href={routes.auth.signIn3}
          className="font-semibold text-gray-700 transition-colors hover:text-gray-1000"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
