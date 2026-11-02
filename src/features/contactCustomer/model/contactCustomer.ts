import { Linking } from 'react-native';

const normalizePhone = (phone: string) => phone.trim().replace(/[^\d+]/g, '');

const openContactUrl = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error('No app is available to handle this action');
  }
  await Linking.openURL(url);
};

export const callCustomer = async (phone: string) => {
  const normalizedPhone = normalizePhone(phone);
  if (!/^\+?\d{7,15}$/.test(normalizedPhone)) {
    throw new Error('Customer phone number is missing or invalid');
  }
  await openContactUrl(`tel:${normalizedPhone}`);
};

export const sendSmsCustomer = async (phone: string) => {
  const normalizedPhone = normalizePhone(phone);
  if (!/^\+?\d{7,15}$/.test(normalizedPhone)) {
    throw new Error('Customer phone number is missing or invalid');
  }
  await openContactUrl(`sms:${normalizedPhone}?body=${encodeURIComponent('On My Way')}`);
};
