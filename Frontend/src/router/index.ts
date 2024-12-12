import { createRouter, createWebHistory } from 'vue-router';

// Import Pages
import Dashboard from '@/pages/Dashboard.vue';
import Buildings from '@/pages/Buildings.vue';
import Units from '@/pages/Units.vue';
import MaintenanceRequests from '@/pages/MaintenanceRequests.vue';
import Reports from '@/pages/Reports.vue';
import Profile from '@/pages/Profile.vue';

// Admin Pages
import ManageRoles from '@/pages/Admin/ManageRoles.vue';
import SystemSettings from '@/pages/Admin/SystemSettings.vue';
import UserManagement from '@/pages/Admin/UserManagement.vue';

// Authentication Pages
import Login from '@/pages/Auth/Login.vue';
import ForgotPassword from '@/pages/Auth/ForgotPassword.vue';

// View Details
import BuildingDetails from '@/views/BuildingDetails.vue';
import UnitDetails from '@/views/UnitDetails.vue';
import MaintenanceDetails from '@/views/MaintenanceDetails.vue';

const routes = [
  // General Routes
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/buildings', name: 'Buildings', component: Buildings },
  { path: '/units', name: 'Units', component: Units },
  { path: '/maintenance', name: 'MaintenanceRequests', component: MaintenanceRequests },
  { path: '/reports', name: 'Reports', component: Reports },
  { path: '/profile', name: 'Profile', component: Profile },

  // Admin Routes
  { path: '/admin/roles', name: 'ManageRoles', component: ManageRoles },
  { path: '/admin/settings', name: 'SystemSettings', component: SystemSettings },
  { path: '/admin/users', name: 'UserManagement', component: UserManagement },

  // Authentication Routes
  { path: '/login', name: 'Login', component: Login },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },

  // View Details Routes
  { path: '/building/:id', name: 'BuildingDetails', component: BuildingDetails, props: true },
  { path: '/unit/:id', name: 'UnitDetails', component: UnitDetails, props: true },
  { path: '/maintenance/:id', name: 'MaintenanceDetails', component: MaintenanceDetails, props: true },

  // Catch-All Route (404)
  { path: '/:catchAll(.*)', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
