// helpers.ts

/**
 * Formats a date to a readable string.
 * @param date - A date string or object.
 * @returns Formatted date string (e.g., "Jan 1, 2024").
 */
export function formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  }
  
  /**
   * Maps roles to human-readable labels.
   * @param role - A role string from the schema.
   * @returns Readable role name.
   */
  export function mapRole(role: string): string {
    const roleMap: Record<string, string> = {
      superUser: "Super User",
      admin: "Administrator",
      tenant: "Tenant",
      TaxiDepartmentUser: "Taxi Department User",
    };
    return roleMap[role] || "Unknown Role";
  }
  
  /**
   * Calculates the total number of units in a building.
   * @param floors - Number of floors per tower.
   * @param unitsPerFloor - Units per floor.
   * @param towerCount - Number of towers in the building.
   * @returns Total units in the building.
   */
  export function calculateTotalUnits(floors: number, unitsPerFloor: number, towerCount: number): number {
    return floors * unitsPerFloor * towerCount;
  }
  
  /**
   * Generates a default display name for users.
   * @param firstName - User's first name.
   * @param lastName - User's last name.
   * @returns Combined full name.
   */
  export function generateDisplayName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  }
  
  /**
   * Sorts an array of objects by a specific key.
   * @param array - Array of objects to sort.
   * @param key - Key to sort by.
   * @param ascending - Whether to sort in ascending order (default: true).
   * @returns Sorted array.
   */
  export function sortByKey<T>(array: T[], key: keyof T, ascending = true): T[] {
    return array.sort((a, b) => {
      if (a[key] < b[key]) return ascending ? -1 : 1;
      if (a[key] > b[key]) return ascending ? 1 : -1;
      return 0;
    });
  }
  
  /**
   * Converts the status to a label with associated color.
   * @param status - Status value from the schema.
   * @returns Status label and color.
   */
  export function getStatusLabel(status: string): { label: string; color: string } {
    const statusMap: Record<string, { label: string; color: string }> = {
      open: { label: "Open", color: "blue" },
      inProgress: { label: "In Progress", color: "orange" },
      resolved: { label: "Resolved", color: "green" },
      unpaid: { label: "Unpaid", color: "red" },
      paid: { label: "Paid", color: "green" },
      pending: { label: "Pending", color: "gray" },
      assigned: { label: "Assigned", color: "yellow" },
      completed: { label: "Completed", color: "green" },
    };
    return statusMap[status] || { label: "Unknown", color: "gray" };
  }
  