import React from 'react';
import { callCustomer } from '../model/contactCustomer';
import { CustomerContactButton } from './CustomerContactButton';

export function CallCustomerButton({ phone }: { phone?: string }) {
  return <CustomerContactButton phone={phone} label="Call" action={callCustomer} />;
}
