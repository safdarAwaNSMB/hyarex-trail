'use client';

import OtpForm from '@/app/auth/(otp)/otp-3/otp-form';
import AuthWrapperThree from '@/app/shared/auth-layout/auth-wrapper-three';
import Cookies from 'js-cookie';
import { Button, Text, ActionIcon, Title } from 'rizzui';
import cn from '@/utils/class-names';
import WidgetCard from '@/components/cards/widget-card';
import CircleProgressBar from '@/components/charts/circle-progressbar';
import { PiSlidersHorizontalDuotone } from 'react-icons/pi';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';



export default function ForgotPassword() {


  const data = [
    {
      name: 'Free 0$/month',
      plan: 'free',
      value: 'Start your journey with our Free plan and enjoy basic features without any cost.',
      description: 'Experience the essentials at no charge and discover what our platform has to offer.',
      color: '#3872FA',
      bgColor: 'bg-[#3872FA]',
      bgActiveColor: 'active:enabled:bg-[#2750AF]',
      message:
        'It is a long established fact that a reader will be distracted by the readable content of a page',
    },
    {
      name: 'Starter 10$/month',
      plan: 'starter',
      value: 'Unlock more features with our Start plan, designed for those ready to take the next step.',
      description: "Enjoy enhanced capabilities and dive deeper into our platform's offerings with the Start subscription.",
      color: '#10b981',
      bgColor: 'bg-[#10b981]',
      bgActiveColor: 'active:enabled:bg-[#059669]',
      message:
        'It is a long established fact that a reader will be distracted by the readable content of a page',
    },
    {
      name: 'Regular 20$/month',
      plan: 'regular',
      value: 'Elevate your experience with the Regular plan, offering a comprehensive set of features.',
      description: "Ideal for regular users, this subscription provides advanced tools and increased access to our platform.",
      color: '#f1416c',
      bgColor: 'bg-[#f1416c]',
      bgActiveColor: 'active:enabled:bg-[#f0106c]',
      message:
        'It is a long established fact that a reader will be distracted by the readable content of a page',
    },
    {
      name: 'Premium 30$/month',
      plan: 'premium',
      value: "Take full advantage of our platform's potential with the Advance plan, tailored for power users.",
      description: "Unleash advanced features, analytics, and exclusive benefits to stay ahead with our Advance subscription.",
      color: '#7928ca',
      bgColor: 'bg-[#7928ca]',
      bgActiveColor: 'active:enabled:bg-[#4c2889]',
      message:
        'It is a long established fact that a reader will be distracted by the readable content of a page',
    },
  ];
  const router = useRouter();
  const verifiedUser: string | undefined = Cookies.get('verifiedUser');
  useEffect(() => {
    if (!verifiedUser) {
      router.push('/auth/sign-in-1')
    }
  }, [verifiedUser])
  const parsedUser: any = verifiedUser ? JSON.parse(verifiedUser) : null;

  const choosePlan = async (index: number) => {
    const choosePlan = data[index];

    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assign-plan`, {...parsedUser, userplan : choosePlan.plan}).then(res => {
      console.log(res);
      toast.success('Thanks For choosing Plan!');
      Cookies.remove('verifiedUser');
      signIn('credentials', {
        ...res.data.user,
        callbackUrl : '/'
      })
    }).catch(err => {
      console.log(err);
      
    })
  }


  return (
    <>
      {/* <AuthWrapperThree
      title={
        <>
          <span className="bg-gradient-to-r from-[#136A8A] to-[#267871] bg-clip-text text-transparent">
            OTP Verification
          </span>
        </>
      }
      className="md:px-20 lg:px-36 lg:py-40"
    >
      <Text className="pb-7 text-center text-[15px] leading-[1.85] text-gray-700 md:text-base md:!leading-loose lg:-mt-1">
        We have sent you One Time Password to. Please enter your OTP
      </Text>
      <OtpForm />
    </AuthWrapperThree> */}
      <div className='p-5 min-h-screen bg-gradient-to-tr from-[#136A8A] to-[#267871]'>
        <Title as='h2' fontWeight='bold' className='text-center mt-3 text-white'>Please Choose a Subscription plan to Continue!</Title>
        <div className='flex flex-wrap min-h-screen  sm:flex-nowrap gap-10  sm:flex-row justify-around items-center  bg-gradient-to-tr from-[#136A8A] to-[#267871]'>
          {data.map((item, index) => (
            <WidgetCard
              key={item.name}
              title={item.name}
              description={item.value}
              rounded="lg"
              // action={
              //   <ActionIcon variant="outline" rounded="full">
              //     <PiSlidersHorizontalDuotone className="h-auto w-5" />
              //   </ActionIcon>
              // }
              descriptionClassName="text-gray-500 mt-1.5"
            // className={cn(className)}
            >
              <div className="mt-5 grid w-full grid-cols-1 justify-around gap-6 @container @sm:py-2 @7xl:gap-8">
                <div className="text-center">
                  <div className="mx-auto mb-5 mt-2 w-full max-w-[180px] sm:mb-7 xl:mb-8 2xl:mb-10 2xl:mt-4">
                    {/* <CircleProgressBar
                    percentage={item.percentage}
                    size={180}
                    stroke="#f0f0f0"
                    strokeWidth={12}
                    progressColor={item.color}
                    label={
                      <Text className="font-lexend text-xl font-bold text-gray-900 @xs:text-2xl">
                        {item.value}
                      </Text>
                    }
                    strokeClassName="dark:stroke-gray-200"
                  /> */}
                  </div>
                  <Text className="leading-relaxed">
                    <Text as="strong" className="font-semibold">
                      {item.description}
                    </Text>{' '}

                  </Text>
                </div>

                <Button
                  size="lg"
                  className={cn(
                    'text-sm font-semibold text-white',
                    item.bgColor,
                    item.bgActiveColor
                  )}
                  onClick={() => choosePlan(index)}
                >
                  Choose Plan
                </Button>
              </div>
            </WidgetCard>
          ))}
        </div>
      </div>
    </>
  );
}
