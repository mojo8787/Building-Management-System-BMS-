import { defineFunction } from '@aws-amplify/backend';

export const processBillPayment = defineFunction({
  name: 'processBillPayment', // Unique name for the function
  entry: './handler.ts', // Path to the handler file
  runtime: 18, // Corrected runtime
  environment: {
    STRIPE_SECRET_KEY: '<your-stripe-secret-key>',
    BILL_TABLE_NAME: 'BillTable',
  },
  timeoutSeconds: 30, // Optional: Execution timeout
  memoryMB: 128, // Optional: Memory allocation
});
