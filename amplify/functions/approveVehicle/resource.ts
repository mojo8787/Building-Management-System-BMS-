import { defineFunction } from '@aws-amplify/backend';

export const approveVehicle = defineFunction({
  name: 'approveVehicle', // Unique name for the function
  entry: './handler.ts', // Path to the handler file
  runtime: 18, // Corrected runtime
  environment: {
    VEHICLE_TABLE_NAME: 'VehicleTable',
  },
  timeoutSeconds: 30, // Optional: Execution timeout
  memoryMB: 128, // Optional: Memory allocation
});
