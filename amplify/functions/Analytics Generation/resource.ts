import { defineFunction } from '@aws-amplify/backend';

export const generateAnalytics = defineFunction({
  name: 'generateAnalytics', // Unique name for the function
  entry: './handler.ts', // Path to the handler file
  runtime: 18, // Corrected runtime
  environment: {
    MAINTENANCE_TABLE_NAME: 'MaintenanceRequestTable',
    BILL_TABLE_NAME: 'BillTable',
  },
  timeoutSeconds: 30, // Optional: Execution timeout
  memoryMB: 512, // Optional: Memory allocation
});
