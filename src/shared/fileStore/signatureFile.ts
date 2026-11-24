import { Directory, File, Paths } from 'expo-file-system';

const signatureDirectory = () => new Directory(Paths.document, 'quoteSignatures');

export function saveSignatureFile(dataUrl: string): string {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl);
  if (!match || match[1].length % 4 !== 0) {
    throw new Error('The signature image is empty or invalid.');
  }

  const directory = signatureDirectory();
  directory.create({ idempotent: true, intermediates: true });

  const filename = `signature-${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
  const file = new File(directory, filename);

  try {
    file.create();
    file.write(match[1], { encoding: 'base64' });
  } catch (writeError: unknown) {
    try {
      if (file.exists) file.delete();
    } catch (cleanupError: unknown) {
      const writeMessage =
        writeError instanceof Error ? writeError.message : 'Unknown filesystem error.';
      const cleanupMessage =
        cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error.';
      throw new Error(
        `Could not save signature: ${writeMessage} Cleanup of the partial file also failed: ${cleanupMessage}`,
      );
    }
    throw writeError;
  }

  if (file.size === 0) {
    file.delete();
    throw new Error('The signature file was saved empty.');
  }

  return file.uri;
}

export function deleteSignatureFile(uri: string): void {
  const file = new File(uri);
  if (file.parentDirectory.uri !== signatureDirectory().uri) {
    throw new Error('Refusing to delete a file outside the quote-signatures directory.');
  }
  if (file.exists) file.delete();
}
