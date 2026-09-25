import React from 'react';
import type { Metadata } from 'next';
import CheckoutFlow from '@/components/checkout/CheckoutFlow';

export const metadata: Metadata = {
  title: 'Agency Checkout & PO Authorization — APEX MEDIA CO',
  description: 'Multi-step white-glove agency collateral checkout and purchase order authorization for APEX clients.',
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
