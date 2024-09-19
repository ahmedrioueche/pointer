"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PricingCard } from '../../../components/PricingCard';
import { apiInsertDB } from "@/lib/dbHelper";
import { useSession } from 'next-auth/react';
import Loading from '@/app/components/Loading';
import { pricingOptions } from '@/data/text';
import { FaMoon, FaSun } from 'react-icons/fa';
import { apiUpdateParent } from '@/lib/apiHelper';
import { payments } from '@/data/values';
import { useTheme } from '@/app/context/ThemeContext';

const Plans: React.FC = () => {
  const {isDarkMode, toggleDarkMode } = useTheme();
  const [loadingCardIndex, setLoadingCardIndex] = useState<number | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login'); 
    }
  }, [status, router]);
  

  useEffect(()=> {
    const parentIdString = sessionStorage.getItem("userId");
    console.log("parentIdString", parentIdString);
    const parentId = parentIdString ? parseInt(parentIdString, 10) : null;
    console.log("parentId", parentId);
    setParentId(parentId);
  }, [])

  const handleClick = async (subscriptionType: string, index: number) => {
    setLoadingCardIndex(index); 

    const type = subscriptionType.toLocaleLowerCase();
    const result = await updateParentPlan(type);

     if (type === "free") {
       router.push('/main/home');

     } else {
        const amount = type === 'monthly' ? payments.monthlyPlanPaymentInDollars : payments.yearlyPlanPaymentInDollars; 
        router.push(`/payment/stripe?plan=${type}&amount=${amount}`); 
      
     }
  };

  const updateParentPlan = async (subscriptionType: string) => {
    let isFreeTrial = false;

    if (subscriptionType === "free")
      isFreeTrial = true;

    const result = await apiUpdateParent(parentId, {subscriptionType : subscriptionType, isFreeTrial : isFreeTrial} )

    console.log("result", result);
    return result;
  };

  return (
    <>
      {session? (
        <section className={`bg-light-background dark:bg-dark-background min-h-screen flex flex-col items-center`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-1 w-full">
              <h2 className={`text-3xl sm:text-3xl md:text-4xl font-bold font-satisfy text-center text-light-primary dark:text-dark-text-primary mx-auto my-4`}>
                Choose Your Plan
              </h2>
              <button
                onClick={toggleDarkMode}
                className="text-xl p-2 rounded-md bg-light-background dark:bg-dark-background focus:outline-none hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              >
                {isDarkMode ? <FaSun className="text-dark-text" /> : <FaMoon className="text-light-text" />}
              </button>
            </div>
            <p className={`text-lg text-center mb-6 font-stix text-light-text dark:text-dark-text`}>
              Select the plan that best fits your needs!
            </p>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-8">
              {pricingOptions.map((option, index) => (
                <PricingCard
                  key={index}
                  {...option}
                  onClick={() => handleClick(option.title, index)}
                  isLoading={loadingCardIndex === index}
                />
              ))}
            </div>
          </div>
        </section>
      ) : 
        <Loading/>
      }
    </>
  );
};

export default Plans;
