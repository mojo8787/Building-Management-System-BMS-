import { defineStore } from 'pinia';

export const useUnitsStore = defineStore('units', {
  state: () => ({
    units: [], // List of units
    selectedUnit: null, // Details of a single unit
  }),
  actions: {
    async fetchUnits(buildingId: string) {
      try {
        const response = await fetch(`/units?buildingId=${buildingId}`);
        this.units = await response.json();
      } catch (error) {
        console.error('Failed to fetch units:', error);
      }
    },
    async fetchUnit(id: string) {
      try {
        const response = await fetch(`/units/${id}`);
        this.selectedUnit = await response.json();
      } catch (error) {
        console.error('Failed to fetch unit:', error);
      }
    },
    async updateUnit(id: string, unitData: any) {
      try {
        const response = await fetch(`/units/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(unitData),
        });
        const updatedUnit = await response.json();
        this.units = this.units.map((u) => (u.id === id ? updatedUnit : u));
      } catch (error) {
        console.error('Failed to update unit:', error);
      }
    },
  },
});
