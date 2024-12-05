import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
    'custom:role': {
      dataType: 'String',
      mutable: true,
      minLen: 1,
      maxLen: 20,
    },
    'custom:tenantId': { // Add tenant ID for multi-tenancy
      dataType: 'String',
      mutable: false, // Prevent modification after creation
    },
  },
  groups: ['superUser', 'admin', 'tenant'], // Define user groups here
});
