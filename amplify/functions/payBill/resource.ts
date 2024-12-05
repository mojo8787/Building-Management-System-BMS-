import { defineFunction } from '@aws-amplify/backend';

export const payBill = defineFunction({
  name: 'payBill', // Unique name for the function
  entry: './handler.ts', // Path to the handler file
  runtime: 18, // Corrected runtime
  environment: {
    STRIPE_SECRET_KEY: '<your-stripe-secret-key>',
    BILL_TABLE_NAME: 'BillTable',
  },
  timeoutSeconds: 30, // Optional: Execution timeout
  memoryMB: 512, // Optional: Memory allocation
});
