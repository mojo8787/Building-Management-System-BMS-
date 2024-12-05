import { defineFunction } from '@aws-amplify/backend';

export const contactRental = defineFunction({
  entry: './handler.ts', // Path to your handler file
  environment: {
    RENTAL_CONTACT_TABLE_NAME: 'RentalContactTable',
  },
  runtime: 18, // Corrected runtime
  memoryMB: 512, // Optional: Specifies memory allocation
});
