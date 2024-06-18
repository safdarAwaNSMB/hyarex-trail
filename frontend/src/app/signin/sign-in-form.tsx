'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@/components/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/utils/validators/login.schema';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';


export default function SignInForm() {
  //TODO: why we need to reset it here
  const initialValues: LoginSchema = {
    email: '',
    password: '',
    rememberMe: false,
  };
  const [reset, setReset] = useState({});
  const [showPlans, setShowPlans] = useState(false)
  const [loading, setLoading] = useState(false)
  const [choosingPlan, setChoosingPlan] = useState(false);
  const verifiedUser: string | undefined = Cookies.get('verifiedUser');
  useEffect(() => {
    if (verifiedUser) {
      const parsedUser: any = verifiedUser ? JSON.parse(verifiedUser) : null;
      if (parsedUser?.userplan?.length === 0 || parsedUser?.userplan !== "null") {
        setShowPlans(true)
      }
    }
  }, [verifiedUser])
  const parsedUser: any = verifiedUser ? JSON.parse(verifiedUser) : null;
  const choosePlan = async (plan: string) => {
    setChoosingPlan(true);
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assign-plan`, { ...parsedUser, userplan: plan }).then(res => {
      toast.success('Thanks For choosing Plan!');
      Cookies.remove('verifiedUser');
      setShowPlans(false)
      signIn('credentials', {
        ...res.data.user,
        callbackUrl: '/'
      })
    }).catch(err => {
      console.log(err);
    }).finally(()=> setChoosingPlan(false))
  }
  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    if(!loading){
      setLoading(true)
      const userResult: any = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sign-in-user`, data).catch(err => {
        setLoading(false)
        if (err.response.status === 400) {
          toast.error(err.response.data.message);
          return
        } else {
          toast.error('Invalid Email or Password!');
          return
        }
      })
      
      if (userResult?.status === 200) {
        if (userResult.data.user.userplan?.length > 0 && userResult.data.user.userplan !== "null") {
          signIn('credentials', {
            ...userResult.data.user,
            callbackUrl: '/'
          });
        } else {
          setLoading(false)
          Cookies.set('verifiedUser', JSON.stringify(userResult.data.user), { expires: 1 });
          setShowPlans(true)
        }
        return
      }
      setLoading(false)
    }
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
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
              size="lg"
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
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
            <div className="flex items-center justify-between pb-2">
              {/* <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                className="[&>label>span]:font-medium"
              /> */}
              <Link
                href={routes.auth.forgotPassword2}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Forget Password?
              </Link>
            </div>
            <Button className="w-full" type="submit" size="lg">
              {loading ? (
                <div className="smallspinner"></div>
              ) : (
                <>
                  <span>Sign in</span>{' '}
                  <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Don’t have an account?{' '}
        <Link
          href={routes.auth.signUp1}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign Up
        </Link>
      </Text>
      {showPlans && (
        <div className="overlay">
          {/* <div className="card red-card">
            <h2>Simple</h2>
            <p>Some plan details here</p>
            <button onClick={() => choosePlan('free')} className="bg-red-500 text-white px-4 py-2 rounded">{choosingPlan === 'free' ? <div className="smallspinner"></div> : "Choose Plan" }</button>
          </div>
          <div className="card orange-card">
            <h2>Average</h2>
            <p>Some plan details here</p>
            <button onClick={() => choosePlan('Average')} className="bg-orange-500 text-white px-4 py-2 rounded">{choosingPlan === 'Average' ? <div className="smallspinner"></div> : "Choose Plan" }</button>
          </div> */}
          <div className="card green-card">
            <h2>Plan for You</h2>
            <p>Some plan details here</p>
            <button onClick={() => !choosingPlan && choosePlan('Premium')} className="bg-green-500 text-white px-4 py-2 rounded">{choosingPlan ? <div className="smallspinner"></div> : "Choose Plan" }</button>
          </div>
        </div>
      )}
    </>
  );
}
