import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import SignatureCanvas, { type SignatureViewRef } from 'react-native-signature-canvas';

export type SignaturePadHandle = {
  clear: () => void;
  read: () => Promise<string>;
};
type Props = {
  onSignatureChange: (hasSignature: boolean) => void;
  onError: (error: Error) => void;
};
type PendingRead = { resolve: (signature: string) => void; reject: (error: Error) => void };

export const SignaturePad = forwardRef<SignaturePadHandle, Props>(function SignaturePad(
  { onSignatureChange, onError },
  forwardedRef,
) {
  const canvasRef = useRef<SignatureViewRef>(null);
  const pendingRead = useRef<PendingRead | null>(null);

  useImperativeHandle(
    forwardedRef,
    () => ({
      clear: () => canvasRef.current?.clearSignature(),
      read: () =>
        new Promise<string>((resolve, reject) => {
          if (!canvasRef.current) {
            reject(new Error('Signature pad is not ready.'));
            return;
          }
          if (pendingRead.current) {
            reject(new Error('A signature read is already in progress.'));
            return;
          }
          pendingRead.current = { resolve, reject };
          canvasRef.current.readSignature();
        }),
    }),
    [],
  );

  const handleSignature = (signature: string) => {
    const currentRead = pendingRead.current;
    if (!currentRead) return;
    pendingRead.current = null;
    currentRead.resolve(signature);
  };

  const handleEmpty = () => {
    onSignatureChange(false);
    const currentRead = pendingRead.current;
    if (!currentRead) return;
    pendingRead.current = null;
    currentRead.reject(new Error('Draw a signature before confirming.'));
  };

  const handleError = (error: Error) => {
    onError(error);
    const currentRead = pendingRead.current;
    if (!currentRead) return;
    pendingRead.current = null;
    currentRead.reject(error);
  };

  return (
    <View style={styles.container}>
      <SignatureCanvas
        ref={canvasRef}
        style={styles.canvas}
        webviewContainerStyle={styles.webview}
        imageType="image/png"
        descriptionText="Sign here"
        penColor="#17211F"
        backgroundColor="#FFFFFF"
        onBegin={() => onSignatureChange(true)}
        onClear={() => onSignatureChange(false)}
        onEmpty={handleEmpty}
        onError={handleError}
        onOK={handleSignature}
        webStyle={`
            .m-signature-pad { box-shadow: none; border: 0; }
            .m-signature-pad--body { border: 0; }
            .m-signature-pad--footer { display: none; margin: 0; }
            html, body { width: 100%; height: 100%; }
          `}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 250,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D0D5D2',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  canvas: { flex: 1 },
  webview: { flex: 1 },
});
