import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false
    },
    'custom:role': {
      dataType: 'String',
      mutable: true,
      minLen: 1,
      maxLen: 20
    }
  },
  roles: ['superUser', 'admin', 'tenant']
});
