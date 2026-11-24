import {
  calculateQuoteTotals,
  parseMinorUnitAmount,
  QUOTE_STATUSES,
  type QuoteFormValues,
} from '@/entities/quote';
import { TableNames } from '@/shared/constants/table-names';
import { database, LineItem, Quote } from '@/shared/db';

export async function createQuote(values: QuoteFormValues): Promise<Quote> {
  const totals = calculateQuoteTotals(values);
  let createdQuote!: Quote;

  await database.write(async () => {
    createdQuote = await database.get<Quote>(TableNames.QUOTES).create((quote) => {
      quote.requestId = values.requestId || undefined;
      quote.title = values.title;
      quote.total = totals.total;
      quote.discount = totals.discount;
      quote.discountPercent = Number(values.discountPercent);
      quote.tax = totals.tax;
      quote.requiredDeposit = totals.requiredDeposit;
      quote.status = QUOTE_STATUSES.DRAFT;
      quote.createdAt = new Date();
      quote.updatedAt = new Date();
    });

    for (const lineItem of values.lineItems) {
      await database.get<LineItem>(TableNames.LINE_ITEMS).create((record) => {
        record.quoteId = createdQuote.id;
        record.name = lineItem.name;
        record.description = lineItem.description;
        record.unitPrice = parseMinorUnitAmount(lineItem.unitPrice);
        record.quantity = Number(lineItem.quantity);
      });
    }
  });

  return createdQuote;
}
