import { defineFunction } from '@aws-amplify/backend';

export const customFunctions = defineFunction({
  // Function to generate QR codes
  generateQRCode: {
    handler: 'src/generateQRCode.handler', // Path to the QR code generation logic
    environment: {
      QR_EXPIRATION_TIME: '3600', // Expiration time in seconds (default: 1 hour)
      QR_TABLE_NAME: 'QRCodeTable', // Name of the DynamoDB table for QR codes
    },
    permissions: ['dynamodb:PutItem'], // Permission to write QR code data to DynamoDB
  },

  // Function to validate QR codes
  validateQRCode: {
    handler: 'src/validateQRCode.handler', // Path to the QR code validation logic
    environment: {
      QR_TABLE_NAME: 'QRCodeTable', // Name of the DynamoDB table for QR codes
    },
    permissions: ['dynamodb:GetItem'], // Permission to read QR code data from DynamoDB
  },

  // Function to register vehicles
  registerVehicle: {
    handler: 'src/registerVehicle.handler', // Path to the vehicle registration logic
    environment: {
      VEHICLE_TABLE_NAME: 'VehicleTable', // Name of the DynamoDB table for vehicles
    },
    permissions: ['dynamodb:PutItem'], // Permission to write vehicle data to DynamoDB
  },

  // Function to approve vehicles
  approveVehicle: {
    handler: 'src/approveVehicle.handler', // Path to the vehicle approval logic
    environment: {
      VEHICLE_TABLE_NAME: 'VehicleTable', // Name of the DynamoDB table for vehicles
    },
    permissions: ['dynamodb:UpdateItem'], // Permission to update vehicle data in DynamoDB
  },

  // Function to handle rental contact requests
  contactRental: {
    handler: 'src/contactRental.handler',
    environment: {
      RENTAL_CONTACT_TABLE_NAME: 'RentalContactTable',
    },
    permissions: ['dynamodb:PutItem'],
  },

  // Function to generate bills
  generateBills: {
    handler: 'src/generateBills.handler',
    environment: {
      UNIT_TABLE_NAME: 'UnitTable',
      BILL_TABLE_NAME: 'BillTable',
    },
    permissions: ['dynamodb:Scan', 'dynamodb:BatchWriteItem'],
  },

  // Function to handle bill payments
  payBill: {
    handler: 'src/payBill.handler',
    environment: {
      STRIPE_SECRET_KEY: '<your-stripe-secret-key>',
      BILL_TABLE_NAME: 'BillTable',
    },
    permissions: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
  },
});
