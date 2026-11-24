import type LineItem from '@/shared/db/model/lineItem';
import type Quote from '@/shared/db/model/quote';
import { z } from 'zod';

const currencyString = z
  .string()
  .trim()
  .regex(/^\d+(?:\.\d{0,2})?$/, 'Enter an amount with up to two decimal places.')
  .refine((value) => Number.isSafeInteger(parseMinorUnitAmount(value)), 'Amount is too large.');

const percentageString = z
  .string()
  .trim()
  .regex(/^\d{1,3}(?:\.\d{0,2})?$/, 'Enter a percentage from 0 to 100.')
  .refine((value) => Number(value) <= 100, 'Percentage cannot exceed 100.');

const lineItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Enter a line item name.').max(200),
  description: z.string().trim().max(2000),
  unitPrice: currencyString,
  quantity: z
    .string()
    .trim()
    .regex(/^[1-9]\d*$/, 'Quantity must be a positive whole number.')
    .refine((value) => Number.isSafeInteger(Number(value)), 'Quantity is too large.'),
});

export const quoteFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Enter a job title.').max(200),
    requestId: z.string().optional(),
    discountPercent: percentageString,
    requiredDeposit: currencyString,
    lineItems: z.array(lineItemSchema).min(1, 'Add at least one line item.'),
  })
  .superRefine((values, context) => {
    let subtotal = 0;
    for (const [index, item] of values.lineItems.entries()) {
      const lineTotal = parseMinorUnitAmount(item.unitPrice) * Number(item.quantity);
      if (!Number.isSafeInteger(lineTotal) || !Number.isSafeInteger(subtotal + lineTotal)) {
        context.addIssue({
          code: 'custom',
          path: ['lineItems', index, 'unitPrice'],
          message: 'Line item total is too large.',
        });
        return;
      }
      subtotal += lineTotal;
    }

    const discount = Math.round((subtotal * Number(values.discountPercent)) / 100);
    const tax = Math.round((subtotal * 5) / 100);
    if (!Number.isSafeInteger(discount) || !Number.isSafeInteger(subtotal - discount + tax)) {
      context.addIssue({
        code: 'custom',
        path: ['discountPercent'],
        message: 'Quote total is too large.',
      });
    }
  });

export type QuoteLineItemFormValue = z.infer<typeof lineItemSchema>;
export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export type QuoteTotals = {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  requiredDeposit: number;
};

export function parseMinorUnitAmount(value: string): number {
  const [whole, fraction = ''] = value.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

function parsePercentageBasisPoints(value: string): number {
  const [whole, fraction = ''] = value.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

export function formatMinorUnitAmount(value: number): string {
  return (value / 100).toFixed(2);
}

export function calculateQuoteTotals(values: QuoteFormValues): QuoteTotals {
  const subtotal = values.lineItems.reduce(
    (sum, lineItem) => sum + parseMinorUnitAmount(lineItem.unitPrice) * Number(lineItem.quantity),
    0,
  );
  const discount = Math.round(
    (subtotal * parsePercentageBasisPoints(values.discountPercent)) / 10000,
  );
  const tax = Math.round((subtotal * 5) / 100);

  return {
    subtotal,
    discount,
    tax,
    total: subtotal - discount + tax,
    requiredDeposit: parseMinorUnitAmount(values.requiredDeposit),
  };
}

export function quoteToFormValues(quote: Quote, lineItems: LineItem[]): QuoteFormValues {
  const subtotal = lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const inferredDiscountPercent =
    subtotal > 0 ? Math.round((quote.discount / subtotal) * 10000) / 100 : 0;
  const discountPercent = quote.discountPercent ?? inferredDiscountPercent;

  return {
    title: quote.title,
    requestId: quote.requestId ?? '',
    discountPercent: String(discountPercent),
    requiredDeposit: formatMinorUnitAmount(quote.requiredDeposit),
    lineItems: lineItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      unitPrice: formatMinorUnitAmount(item.unitPrice),
      quantity: String(item.quantity),
    })),
  };
}
