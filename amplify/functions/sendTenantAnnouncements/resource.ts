import { defineFunction } from '@aws-amplify/backend';

export const sendTenantAnnouncements = defineFunction({
  name: 'sendTenantAnnouncements', // Unique name for the function
  entry: './handler.ts', // Path to the handler file
  runtime: 18, // Corrected runtime
  environment: {
    MESSAGE_TABLE_NAME: 'MessageTable',
  },
  timeoutSeconds: 30, // Optional: Execution timeout
  memoryMB: 128, // Optional: Memory allocation
});
