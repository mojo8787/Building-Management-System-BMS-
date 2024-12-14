import { defineFunction } from '@aws-amplify/backend';

export const handleTaxiRequest = defineFunction({
    name: 'handleTaxiRequests',
    entry: './handler.ts', // Path to the handler file
    runtime: 18,
    environment: {
      TAXI_REQUEST_TABLE_NAME: 'TaxiRequestTable', // Table name for taxi requests
    },
    timeoutSeconds: 30,
    memoryMB: 128,
  });