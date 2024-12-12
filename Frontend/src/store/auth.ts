import { defineStore } from 'pinia';
import { Auth } from '@aws-amplify/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const user = await Auth.signIn(email, password);
        this.user = user;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    async logout() {
      try {
        await Auth.signOut();
        this.user = null;
        this.isAuthenticated = false;
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    async fetchCurrentUser() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        this.user = user;
        this.isAuthenticated = true;
      } catch {
        this.isAuthenticated = false;
      }
    },
  },
});
