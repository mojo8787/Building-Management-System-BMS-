import { defineFunction } from '@aws-amplify/backend';

export const generateBills = defineFunction({
  name: 'generateBills', // Unique name for the function
  entry: './handler.ts', // Path to the handler file
  runtime: 18, // Corrected runtime
  environment: {
    UNIT_TABLE_NAME: 'UnitTable', // Environment variable for Unit table
    BILL_TABLE_NAME: 'BillTable', // Environment variable for Bill table
  },
  timeoutSeconds: 30, // Optional: Function timeout (default is 25 seconds)
  memoryMB: 128, // Optional: Memory allocation (default is 128 MB)
});
