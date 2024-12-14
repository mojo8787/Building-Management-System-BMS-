import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

// Import all functions
import { generateAnalytics } from './functions/generateAnalytics/resource';
import { assignMaintenanceRequests } from './functions/assignMaintenanceRequests/resource';
import { sendTenantAnnouncements } from './functions/sendTenantAnnouncements/resource';
import { approveVehicle } from './functions/approveVehicle/resource';
import { contactRentalUnit } from './functions/contactRentalUnit/resource';
import { generateBills } from './functions/generateBills/resource';
import { generateQRCode } from './functions/generateQRCode/resource';
import { processBillPayment } from './functions/processBillPayment/resource';
import { registerVehicle } from './functions/registerVehicle/resource';
import { validateQRCode } from './functions/validateQRCode/resource';
import { assignTaxiRequests } from './functions/assignTaxiRequests/resource';
import { handleTaxiRequest } from './functions/handleTaxiRequests/resource';

export const backend = defineBackend({
  auth,
  data,
  storage,

  // Directly include functions here
  generateAnalytics,
  assignMaintenanceRequests,
  sendTenantAnnouncements,
  approveVehicle,
  contactRentalUnit,
  generateBills,
  generateQRCode,
  processBillPayment,
  registerVehicle,
  validateQRCode,
  assignTaxiRequests,
  handleTaxiRequest,
});
