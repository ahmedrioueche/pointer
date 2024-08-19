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

const Plans: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loadingCardIndex, setLoadingCardIndex] = useState<number | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  //if (status === 'loading') return <Loading />;
  //if (!session) {
  //  router.push('/auth/login');
  //}

  useEffect(()=> {
    const parentIdString = sessionStorage.getItem("parentId");
    console.log("parentIdString", parentIdString);
    const parentId = parentIdString ? parseInt(parentIdString, 10) : null;
    console.log("parentId", parentId);
    setParentId(parentId);
})

  const handleClick = async (price: string, index: number) => {
    setLoadingCardIndex(index); 
    await updateParentPlan(price);

     if (price === "$0") {
       router.push('/main/dashboard');
     } else {
       router.push('/auth/payment');
     }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  const getSubscriptionType = (price: string) => {
    switch (price) {
      case "$0":
        return "free";
      case "$19":
        return "standard";
      case "$199":
        return "premium";
      default:
        return null;
    }
  };

  const updateParentPlan = async (price: string) => {
    const subscriptionType = getSubscriptionType(price);

    const result = await apiUpdateParent(parentId, {subscription_type : subscriptionType} )

    console.log("result", result);
  };

  return (
    <section className={`bg-light-background dark:bg-dark-background min-h-screen flex flex-col items-center`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-1 w-full">
          <h2 className={`text-3xl sm:text-3xl md:text-4xl font-bold font-satisfy text-center text-light-primary dark:text-dark-text-primary mx-auto my-4`}>
            Choose Your Plan
          </h2>
          <button
            onClick={toggleTheme}
            className="text-xl p-2 rounded-md bg-light-background dark:bg-dark-background focus:outline-none hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            {isDarkMode ? <FaSun className="text-dark-text" /> : <FaMoon className="text-light-text" />}
          </button>
        </div>
        <p className={`text-lg text-center mb-6 font-stix text-light-text dark:text-dark-text`}>
          Select the plan that best fits your needs. All plans come with a 14-day free trial!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {pricingOptions.map((option, index) => (
            <PricingCard
              key={index}
              {...option}
              onClick={() => handleClick(option.price, index)}
              isLoading={loadingCardIndex === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
