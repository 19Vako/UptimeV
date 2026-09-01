import { triggerNativeScan } from '@/shared/docScanner/scanDocument';
import { saveScanToPersistentStorage } from '@/shared/fileStore/saveScanFile';

export const scanDocument = async (): Promise<string | null> => {
  try {
    const scan = await triggerNativeScan();

    if (scan.status === 'cancel') {
      return null;
    }

    const scannedImages = scan.scannedImages ?? [];

    if (scannedImages.length === 0) {
      return null;
    }

    const scanLocalDocUrl = saveScanToPersistentStorage(scannedImages[0]);

    return scanLocalDocUrl;
  } catch {
    return null;
  }
};
