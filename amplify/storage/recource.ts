import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  buckets: [
    {
      name: 'rental-photos',
      access: (allow) => ({
        'photos/*': [
          allow.guest.to(['read']),
          allow.authenticated.to(['read', 'write', 'delete'])
        ]
      })
    },
    {
      name: 'profile-pictures',
      access: (allow) => ({
        'profile-pictures/{entity_id}/*': [
          allow.guest.to(['read']),
          allow.entity('identity').to(['read', 'write', 'delete'])
        ]
      })
    }
  ],
});