import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'rentalStorage',
  access: (allow) => ({
    'photos/*': [
      allow.guest.to(['read']), // Corrected for unauthenticated users
      allow.authenticated.to(['read', 'write', 'delete']), // Authenticated users
    ],
    'profile-pictures/{entity_id}/*': [
      allow.guest.to(['read']), // Unauthenticated users
      allow.entity('identity').to(['read', 'write', 'delete']), // Owner access
    ],
  }),
});
