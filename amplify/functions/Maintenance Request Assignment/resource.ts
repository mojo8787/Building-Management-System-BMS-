import { defineFunction } from '@aws-amplify/backend';

export const assignMaintenanceRequest = defineFunction({
  name: 'assignMaintenanceRequest', // Unique name for the function
  entry: './handler.ts', // Path to the handler file
  runtime: 18, // Corrected runtime
  environment: {
    MAINTENANCE_TABLE_NAME: 'MaintenanceRequestTable',
    USER_TABLE_NAME: 'UserTable',
  },
  timeoutSeconds: 30, // Optional: Execution timeout
  memoryMB: 512, // Optional: Memory allocation
});
