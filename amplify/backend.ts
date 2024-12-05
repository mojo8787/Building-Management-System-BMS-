import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

// Import all functions
import { generateAnalytics } from './functions/Analytics Generation/resource';
import { assignMaintenanceRequest } from './functions/Maintenance Request Assignment/resource';
import { broadcastAnnouncement } from './functions/Tenant Announcements/resource';
import { approveVehicle } from './functions/approveVehicle/resource';
import { contactRental } from './functions/contactRental/resource';
import { generateBills } from './functions/generateBills/resource';
import { generateQRCode } from './functions/generateQRCode/resource';
import { payBill } from './functions/payBill/resource';
import { registerVehicle } from './functions/registerVehicle/resource';
import { validateQRCode } from './functions/validateQRCode/resource';

export const backend = defineBackend({
  auth,
  data,
  storage,

  // Directly include functions here
  generateAnalytics,
  assignMaintenanceRequest,
  broadcastAnnouncement,
  approveVehicle,
  contactRental,
  generateBills,
  generateQRCode,
  payBill,
  registerVehicle,
  validateQRCode,
});
