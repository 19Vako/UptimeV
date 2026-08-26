import { Directory, File, Paths } from 'expo-file-system';

export const saveScanToPersistentStorage = (tempUri: string): string => {
  const documentScans = new Directory(Paths.document, 'documentScans');

  if (!documentScans.exists) {
    documentScans.create();
  }

  const scanFile = new File(tempUri);
  scanFile.move(documentScans);

  return scanFile.uri;
};
