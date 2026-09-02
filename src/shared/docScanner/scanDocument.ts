import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin';

export type NativeScanResult = {
  status?: 'success' | 'cancel';
  scannedImages?: string[];
};

export const triggerNativeScan = async (): Promise<NativeScanResult> => {
  try {
    const result = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      croppedImageQuality: 80,
      responseType: ResponseType.ImageFilePath,
    });

    return {
      status: result.status,
      scannedImages: result.scannedImages ?? [],
    };
  } catch (error) {
    throw error;
  }
};
