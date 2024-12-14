import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true, // Users log in using email
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false, // Optional display name for users
    },
    'custom:role': { // Defines the role of the user within their tenant
      dataType: 'String',
      mutable: true,
      minLen: 1,
      maxLen: 20, // Roles like 'superUser', 'admin', 'tenant'
    },
    'custom:tenantId': { // Associates the user with a specific tenant (complex)
      dataType: 'String',
      mutable: false, // Immutable to ensure correct tenant isolation
    },
    'custom:region': { // Optional: Geographical region of the tenant (e.g., Brno, Amman, berlin, etc)
      dataType: 'String',
      mutable: true,
      minLen: 2,
      maxLen: 50,
    },
  },
  groups: [
    'providerSuperAdmin', // Your global role for managing all tenants
    'superUser',          // Tenant-level super admin
    'admin',              // Tenant-level admin
    'tenant',             // Tenant-level user
  ],
});
