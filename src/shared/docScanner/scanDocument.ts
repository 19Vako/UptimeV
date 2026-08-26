import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin';

export const triggerNativeScan = async (): Promise<string[]> => {
  const { scannedImages } = await DocumentScanner.scanDocument({
    maxNumDocuments: 1,
    croppedImageQuality: 80,
    responseType: ResponseType.ImageFilePath,
  });
  return scannedImages || [];
};
