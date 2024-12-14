import { defineFunction } from '@aws-amplify/backend';

export const contactRentalUnit = defineFunction({
  entry: './handler.ts', // Path to your handler file
  environment: {
    RENTAL_CONTACT_TABLE_NAME: 'RentalContactTable',
  },
  runtime: 18, // Corrected runtime
  memoryMB: 128, // Optional: Specifies memory allocation
});
