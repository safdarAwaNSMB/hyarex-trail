'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PiArrowRightBold } from 'react-icons/pi';
import { Password, Button, Input, Text } from 'rizzui';
import { routes } from '@/config/routes';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();
  const pendingUser = Cookies.get('pendingUser');
  const parsedUser = pendingUser ? JSON.parse(pendingUser) : null;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: parsedUser?.firstname || '',
    lastname: parsedUser?.lastname || '',
    email: parsedUser?.email || '',
    password: parsedUser?.password || '',
    confirmpassword: parsedUser?.confirmpassword || '',
    isagreed: parsedUser?.isagreed || false,
  });

  function generateVerificationCode(minLength = 5) {
    const characters = '0123456789';
    const length = Math.max(minLength, 5);
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  const handleChange = (e : any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const onSubmit = async (e : any) => {
    e.preventDefault();
    const { firstname, lastname, email, password, confirmpassword } = formData;
    if (loading) return;

    if (password === confirmpassword) {
      setLoading(true);
      
      try {
        const userExist = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-existence`, { email });
        if (userExist.status === 200) {
          toast.error(userExist.data.message);
        } else if (userExist.status === 201) {
          const verificationcode = generateVerificationCode();
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-verification-Email`, { ...formData, verificationcode });
          Cookies.set('pendingUser', JSON.stringify(formData), { expires: 1 });
          toast.success('Verification Email sent!');
          router.push('/auth/otp-4');
        }
      } catch (err) {
        toast.error('Server Error');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Confirm Password not matched!');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5">
          <Input
            type="text"
            size="lg"
            label="First Name"
            placeholder="Enter your first name"
            className="[&>label>span]:font-medium"
            inputClassName="text-sm"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            size="lg"
            label="Last Name"
            placeholder="Enter your last name"
            className="[&>label>span]:font-medium"
            inputClassName="text-sm"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            size="lg"
            label="Email"
            className="col-span-2 [&>label>span]:font-medium"
            inputClassName="text-sm"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Password
            label="Password"
            placeholder="Enter your password"
            size="lg"
            className="[&>label>span]:font-medium"
            inputClassName="text-sm"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Password
            label="Confirm Password"
            placeholder="Enter confirm password"
            size="lg"
            className="[&>label>span]:font-medium"
            inputClassName="text-sm"
            name="confirmpassword"
            value={formData.confirmpassword}
            onChange={handleChange}
            required
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
            {loading ? (
              <div className="smallspinner"></div>
            ) : (
              <>
                <span>Get Started</span>{' '}
                <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Already have an account?{' '}
        <Link
          href={'/'}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
