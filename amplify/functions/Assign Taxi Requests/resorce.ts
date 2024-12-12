export const assignTaxiRequest = defineFunction({
    name: 'assignTaxiRequest',
    entry: './handler.ts',
    runtime: 18,
    environment: {
      TAXI_REQUEST_TABLE_NAME: 'TaxiRequestTable',
      DEPARTMENT_TABLE_NAME: 'DepartmentTable', // Optional, if departments are modeled separately
    },
    timeoutSeconds: 30,
    memoryMB: 512,
  });
  