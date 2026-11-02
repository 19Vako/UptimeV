import React from 'react';
import { sendSmsCustomer } from '../model/contactCustomer';
import { CustomerContactButton } from './CustomerContactButton';

export function SendSmsButton({ phone }: { phone?: string }) {
  return <CustomerContactButton phone={phone} label="On my way" action={sendSmsCustomer} />;
}
