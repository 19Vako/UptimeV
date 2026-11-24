import { TableNames } from '@/shared/constants/table-names';
import { database, Quote } from '@/shared/db';
import { deleteSignatureFile, saveSignatureFile } from '@/shared/fileStore/signatureFile';

export async function confirmQuoteSignature(quoteId: string, signatureDataUrl: string) {
  if (!quoteId.trim()) throw new Error('A quote ID is required to save a signature.');

  const quote = await database.get<Quote>(TableNames.QUOTES).find(quoteId);
  const signatureUri = saveSignatureFile(signatureDataUrl);

  try {
    await database.write(() =>
      quote.update((record) => {
        record.signatureUrl = signatureUri;
        record.updatedAt = new Date();
      }),
    );
  } catch (databaseError: unknown) {
    try {
      deleteSignatureFile(signatureUri);
    } catch (cleanupError: unknown) {
      const databaseMessage =
        databaseError instanceof Error ? databaseError.message : 'Unknown database error.';
      const cleanupMessage =
        cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error.';
      throw new Error(
        `Could not save the quote signature: ${databaseMessage} Cleanup of the local signature file also failed: ${cleanupMessage}`,
      );
    }
    throw databaseError;
  }

  return signatureUri;
}
