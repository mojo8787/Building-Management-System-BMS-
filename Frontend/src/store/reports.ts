import { defineStore } from 'pinia';

export const useReportsStore = defineStore('reports', {
  state: () => ({
    reports: [], // List of reports
    selectedReport: null, // Details of a single report
  }),
  actions: {
    async fetchReports() {
      try {
        const response = await fetch('/reports');
        this.reports = await response.json();
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    },
    async fetchReport(id: string) {
      try {
        const response = await fetch(`/reports/${id}`);
        this.selectedReport = await response.json();
      } catch (error) {
        console.error('Failed to fetch report:', error);
      }
    },
  },
});
