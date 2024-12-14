import { defineFunction } from '@aws-amplify/backend';

export const validateQRCode = defineFunction({
  name: 'validateQRCode', // Unique name for the function
  entry: './handler.ts', // Path to the handler file
  runtime: 18, // Corrected runtime
  environment: {
    QR_TABLE_NAME: 'QRCodeTable',
  },
  timeoutSeconds: 30, // Optional: Execution timeout
  memoryMB: 128, // Optional: Memory allocation
});
