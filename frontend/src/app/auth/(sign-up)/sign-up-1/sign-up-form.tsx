'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Password, Checkbox, Button, Input, Text } from 'rizzui';
import { Form } from '@/components/ui/form';
import { routes } from '@/config/routes';
import { SignUpSchema, signUpSchema } from '@/utils/validators/signup.schema';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';


export default function SignUpForm() {
  const [reset, setReset] = useState({});
  const router = useRouter();
  const pendingUser: string | undefined = Cookies.get('pendingUser');
  const parsedUser: any = pendingUser ? JSON.parse(pendingUser) : null;

  const initialValues = {
    firstname: parsedUser?.firstname || '',
    lastname: parsedUser?.lastname || '',
    email: parsedUser?.email || '',
    password: parsedUser?.password || '',
    confirmpassword: parsedUser?.confirmpassword || '',
    isagreed: parsedUser?.isagreed || false,
  };

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
  console.log(parsedUser);
  console.log(pendingUser);

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    console.log(data);
    if (data.password === data.confirmpassword) {

      const userExist = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-existence`, data).catch(err => {
        toast.error('Server Error');
      })
      if (userExist?.status === 201) {
        toast.error(userExist?.data.message);
        return
      } else if (userExist?.status === 200) {
        const verificationcode = generateVerificationCode();
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-verification-Email`, { ...data, verificationcode }).then((res) => {
          console.log(res.data.data);
          Cookies.set('pendingUser', JSON.stringify(res.data.data), { expires: 1 });
          toast.success('Verification Email sent!');
          router.push('/auth/otp-4')
        }).catch(err => {
          toast.error('Error in sending mail, Try Again!')
        })
      }
    } else {
      toast.error('Confirm Password not matched!')
    };
  }

  // setReset({ ...initialValues, isAgreed: false });
  return (
    <>
      <Form<SignUpSchema>
        validationSchema={signUpSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5">
            <Input
              type="text"
              size="lg"
              label="First Name"
              placeholder="Enter your first name"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('firstname')}
              error={errors.firstname?.message}
            />
            <Input
              type="text"
              size="lg"
              label="Last Name"
              placeholder="Enter your last name"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('lastname')}
              error={errors.lastname?.message}
            />
            <Input
              type="email"
              size="lg"
              label="Email"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              placeholder="Enter your email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <Password
              label="Confirm Password"
              placeholder="Enter confirm password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('confirmpassword')}
              error={errors.confirmpassword?.message}
            />
            <div className="col-span-2 flex items-start ">
              <>
                By signing up you have agreed to our{' '}
                <Link
                  href="/"
                  className="font-medium text-blue transition-colors hover:underline"
                >
                  Terms
                </Link>{' '}
                &{' '}
                <Link
                  href="/"
                  className="font-medium text-blue transition-colors hover:underline"
                >
                  Privacy Policy
                </Link>
              </>
            </div>
            <Button size="lg" type="submit" className="col-span-2 mt-2">
              <span>Get Started</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Don’t have an account?{' '}
        <Link
          href={routes.auth.signIn1}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
