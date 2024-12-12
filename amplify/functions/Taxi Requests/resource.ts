export const handleTaxiRequest = defineFunction({
    name: 'handleTaxiRequest',
    entry: './handler.ts', // Path to the handler file
    runtime: 18,
    environment: {
      TAXI_REQUEST_TABLE_NAME: 'TaxiRequestTable', // Table name for taxi requests
    },
    timeoutSeconds: 30,
    memoryMB: 512,
  });
  