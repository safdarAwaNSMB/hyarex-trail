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
const tutorialData = [
  {
    heading: "Dashboards",
    content: "Here you will find a visual summary of crucial information, such as key statistics, charts, metrics and trading history.  Use intuitive navigation elements to explore detailed data.  Interact with widgets to get real-time information and use filtering options to focus on specific areas of interest."
  },
  {
    heading: "Find products",
    content: "The ideal place to discover and search for products efficiently.  Use smart filters to narrow down the options based on your preferences.  Use the search bar for instant results and view key details like pricing, reviews and availability. Search products via images or links using our cutting-edge AI."
  },
  {
    heading: "My products",
    content: "Your personal space to quickly view the products you have saved or purchased, check the status of your orders and manage any returns or changes. Use sorting options and filters to easily organize your collection. Add products to the list to keep an eye on them and receive notifications about order updates."
  },
  {
    heading: "Quotations",
    content: "Create and manage new quotes or branding requests by entering key details such as description, quantity, links, images or other references. Monitor the status of quotes, from creation to confirmation.  Use filters to quickly find specific quotes and receive notifications about updates."
  },
  {
    heading: "Virtual Warehouse",
    content: "The virtual place to manage your inventory in our warehouse in China in an intuitive way.  Add new products, monitor available quantities and manage warehouse movements.  Use filters to quickly locate specific items and optimize logistics by viewing details such as location and status."
  },
  {
    heading: "Orders",
    content: "The order management center.  Quickly view pending, confirmed or shipped orders.  View order status in real time. Use filters to easily navigate through orders.  Automatically pay for orders with funds in your e-wallet."
  },
  {
    heading: "Support",
    content: "Access useful resources, such as FAQs and guides.  Submit support requests and track the status of your requests. Interact with the support team through the ticketing system and receive real-time updates."
  },
  {
    heading: "E-wallet",
    content: "Your virtual wallet.  Add funds, monitor your balance and manage transactions securely.  View transaction history and set up notifications for real-time updates."
  },
  {
    heading: "Profile",
    content: "Keep personal and business information up to date.  Access your profile settings, edit details such as name, address and company information.  Manage subscriptions and add account managers by assigning rules and permissions.  Ensure that all information is correct for optimal management of your account."
  },

]

export default function OtpForm() {
  const pendingUser: string | undefined = Cookies.get('pendingUser');
  const parsedUser: any = pendingUser ? JSON.parse(pendingUser) : null;
  const [otpError, setOtpError] = useState(false);
  const router = useRouter();
  const [showPlans, setShowPlans] = useState(false)
  const verifiedUser: string | undefined = Cookies.get('verifiedUser');
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [choosing, setChoosing] = useState(false)
  useEffect(() => {
    if (verifiedUser) {
      const parsedUser: any = verifiedUser ? JSON.parse(verifiedUser) : null;
      if (parsedUser?.userplan?.length === 0 || parsedUser?.userplan !== "null") {
        setShowPlans(true)
      }
    }
  }, [verifiedUser])
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentValue, setCurrentValue] = useState(0);
  const [readyToSignUser, setReadyToSignUser] = useState<any>(null)

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
  const resendOTP = async () => {
    try {
      setResending(true)
      const verificationcode = generateVerificationCode();
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-verification-Email`, { ...parsedUser, verificationcode }).then((res) => {
        console.log(res.data.data);
        Cookies.set('pendingUser', JSON.stringify(res.data.data), { expires: 1 });
        toast.success('Verification Email sent!');
        router.push('/auth/otp-4')
      }).catch(err => {
        toast.error('Error in sending mail, Try Again!')
      }).finally(() => setResending(false))
    } catch (error) {

    }
  }

  const choosePlan = async (plan: string) => {
    if (verifiedUser) {
      setChoosing(true)
      const parsedUser: any = verifiedUser ? JSON.parse(verifiedUser) : null;
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assign-plan`, { ...parsedUser, userplan: plan }).then(res => {
        console.log(res);
        toast.success('Thanks For choosing Plan!');
        Cookies.remove('verifiedUser');
        setShowPlans(false);
        setShowTutorial(true);
        setReadyToSignUser(res.data.user)
        // signIn('credentials', {
        //   ...res.data.user,
        //   callbackUrl: '/'
        // })
      }).catch(err => {
        console.log(err);
      }).finally(()=> setChoosing(false))
    } else {
      toast.error('Please Fill the signUp Form')
    }
  }
  const proceedSignIn = async () => {
    if (readyToSignUser?.userplan) {
      signIn('credentials', {
        ...readyToSignUser,
        callbackUrl: '/'
      })
    } else {
      toast.error('Please Choose plan before sign Up!');
      setShowTutorial(false);
      setShowPlans(true)
    }
  }


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!loading && !resending) {
      if (data.otp?.length !== 5) {
        setOtpError(true);
      } else {
        if (data.otp === parsedUser?.verificationcode) {
          setLoading(true)
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/buyer-sign-up`, parsedUser).then(res => {
            toast.success('Your Account has been created!');
            Cookies.set('verifiedUser', JSON.stringify(res.data.data), { expires: 1 })
            Cookies.remove('pendingUser');
            setShowPlans(true)
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
              onClick={() => (!loading && !resending) && resendOTP()}
              size="xl"
              variant="outline"
              rounded="lg"
            >
              {resending ? <div className="blacksmallspinner"></div> : "Resend OTP"}
            </Button>
            <Button
              className="w-full text-base font-medium"
              type="submit"
              size="xl"
              rounded="lg"
            >
              {loading ? <div className="smallspinner"></div> : "Verify OTP"}
            </Button>
          </div>
        )}
      </Form>
      {showPlans && (
        <div className="overlay">
          {/* <div className="card relative red-card">
            <h2>Simple</h2>
            <p>Some plan details here</p>
            <button onClick={() => choosePlan('free')} className="bg-red-500 w-9/12 ms-9 absolute left-0 bottom-2 text-white px-4 py-2 rounded">Choose Plan</button>
          </div>
          <div className="card relative orange-card">
            <h2>Average</h2>
            <p>Some plan details here</p>
            <button onClick={() => choosePlan('Average')} className="bg-orange-500 w-9/12 ms-9 absolute left-0 bottom-2 text-white px-4 py-2 rounded">Choose Plan</button>
          </div> */}
          <div className="card relative green-card">
            <h2 className=' text-green-600'>Premium</h2>
            <p className='text-black'>Some plan details here</p>
            <button onClick={() => !choosing && choosePlan('Premium')} className="bg-green-500 w-9/12 ms-9 absolute left-0 bottom-2 text-white px-4 py-2 rounded">{choosing ? <div className='smallspinner mx-auto'></div> : "Choose Plan"}</button>
          </div>
        </div>
      )}
      {showTutorial && (
        <div className="overlay">
          <div className="card relative black-card">
            <p className='mb-4 text-start text-slate-400'>{currentValue + 1}/{tutorialData?.length}</p>
            <h2 className='text-white'>{tutorialData[currentValue]?.heading}</h2>
            <p>{tutorialData[currentValue]?.content}</p>
            <div className='flex justify-end mt-4 absolute bottom-0 w-full p-5 px-7'>
              <button onClick={() => proceedSignIn()} className=" text-blue-400 font-bold px-1 mx-1 py-1 rounded">Skip</button>
              <button onClick={() => currentValue === tutorialData?.length ? proceedSignIn() : setCurrentValue(currentValue + 1)} className="bg-blue-700 text-white px-2 mx-1 py-2 rounded">Next</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
