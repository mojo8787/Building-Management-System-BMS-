import { defineStore } from 'pinia';

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    requests: [], // List of maintenance requests
    selectedRequest: null, // Details of a single maintenance request
  }),
  actions: {
    async fetchRequests(unitId: string) {
      try {
        const response = await fetch(`/maintenance?unitId=${unitId}`);
        this.requests = await response.json();
      } catch (error) {
        console.error('Failed to fetch maintenance requests:', error);
      }
    },
    async createRequest(requestData: any) {
      try {
        const response = await fetch('/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        this.requests.push(await response.json());
      } catch (error) {
        console.error('Failed to create maintenance request:', error);
      }
    },
    async updateRequest(id: string, requestData: any) {
      try {
        const response = await fetch(`/maintenance/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
        const updatedRequest = await response.json();
        this.requests = this.requests.map((r) => (r.id === id ? updatedRequest : r));
      } catch (error) {
        console.error('Failed to update maintenance request:', error);
      }
    },
  },
});
