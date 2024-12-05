import { defineFunction } from '@aws-amplify/backend';

export const generateQRCode = defineFunction({
  name: 'generateQRCode',
  entry: './handler.ts',
  runtime: 18,
  environment: {
    QR_EXPIRATION_TIME: '3600',
    QR_TABLE_NAME: 'QRCodeTable',
  },
  timeoutSeconds: 30,
  memoryMB: 512,
});
