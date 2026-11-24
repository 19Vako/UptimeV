import { TableNames } from '@/shared/constants/table-names';
import { database, Quote } from '@/shared/db';

export async function deleteQuote(id: string): Promise<void> {
  await database.write(async () => {
    const quote = await database.get<Quote>(TableNames.QUOTES).find(id);
    const lineItems = await quote.lineItems.fetch();

    for (const lineItem of lineItems) {
      await lineItem.markAsDeleted();
    }

    await quote.markAsDeleted();
  });
}
