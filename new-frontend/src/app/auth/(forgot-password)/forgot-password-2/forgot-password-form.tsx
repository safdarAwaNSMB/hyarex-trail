'use client';

import { Input, Text, Button } from 'rizzui';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useState } from 'react';
import { routes } from '@/config/routes';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useMedia } from '@/hooks/use-media';
import {
  forgetPasswordSchema,
  ForgetPasswordSchema,
} from '@/utils/validators/forget-password.schema';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const userToReset: string | undefined = Cookies.get('userToReset');
const parsedUserToReset: any = userToReset ? JSON.parse(userToReset) : null;
const initialValues = {
  email: parsedUserToReset?.email || "",
};

export default function ForgetPasswordForm() {
  const isMedium = useMedia('(max-width: 1200px)', false);
  const [reset, setReset] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  function generateVerificationCode(minLength = 5): string {
    const characters = '0123456789';
    const length = Math.max(minLength, 5); // Ensure minimum length of 5
    let result = '';
    for (let i = 0; i < length; i++) {
      // Randomly select a character from the pool
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }



  const onSubmit: SubmitHandler<ForgetPasswordSchema> = async (data) => {
    if (!loading) {
      setLoading(true)
      const userExist = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-existence`, data).catch(err => {
        toast.error('Server Error');
        setLoading(false)
        return
      })
      if (userExist?.status === 201) {
        toast.error(userExist?.data.message);
        setLoading(false)
        return
      } else if (userExist?.status === 200) {
        const verificationcode = generateVerificationCode();
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-verification-Email`, { ...userExist?.data?.user, verificationcode }).then((res) => {
          console.log(res.data.data);
          Cookies.set('userToReset', JSON.stringify(res.data.data), { expires: 1 });
          toast.success(<Text>
            Reset link sent to this email:{' '}
            <Text as="b" className="font-semibold">
              {res.data.data.email}
            </Text>
          </Text>);
          router.push('/auth/forgot-password-3')
        }).catch(err => {
          toast.error('Error in sending mail, Try Again!')
        }).finally(() => setLoading(false))
      }
    }
  };

  return (
    <>
      <Form<ForgetPasswordSchema>
        validationSchema={forgetPasswordSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size={isMedium ? 'lg' : 'xl'}
              label="Email"
              placeholder="Enter your email"
              rounded="pill"
              className="[&>label>span]:font-medium"
              {...register('email')}
              error={errors.email?.message as string}
            />
            <Button
              className="border-primary-light w-full border-2 text-base font-medium"
              type="submit"
              size={isMedium ? 'lg' : 'xl'}
              rounded="pill"
            >{loading ? <div className='smallspinner'></div> : "Reset Password"}
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-5 text-center text-[15px] leading-loose text-gray-500 lg:text-start xl:mt-7 xl:text-base">
        Don’t want to reset?{' '}
        <Link
          href={routes.auth.signIn2}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
