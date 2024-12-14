import { defineFunction } from '@aws-amplify/backend';

export const assignTaxiRequests = defineFunction({
  name: 'assignTaxiRequests',
  entry: './handler.ts',
  runtime: 18,
  environment: {
    TAXI_REQUEST_TABLE_NAME: 'TaxiRequestTable',
    DEPARTMENT_TABLE_NAME: 'DepartmentTable',
  },
  timeoutSeconds: 30,
  memoryMB: 128,
});
