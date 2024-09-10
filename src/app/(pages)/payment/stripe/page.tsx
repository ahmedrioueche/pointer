// pages/checkout.tsx
import React, { Suspense } from 'react';
import StripeContainer from '../../../components/payment/StripeContainer';
import CheckoutForm from '../../../components/payment/CheckoutForm';
import Loading from '@/app/components/Loading';

const CheckoutPage: React.FC = () => {
  return (
    <StripeContainer>
      <Suspense fallback={<Loading/>}>
         <CheckoutForm />
      </Suspense>
    </StripeContainer>
  );
};

export default CheckoutPage;
