import { defineData, a } from '@aws-amplify/backend';

const schema = a.schema({
  // Building Model
  Building: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    name: a.string().required(),
    address: a.string().required(),
    towerCount: a.integer().required(),
    floorsPerTower: a.integer().required(),
    unitsPerFloor: a.integer().required(),
    units: a.hasMany('Unit', 'buildingId'),
    events: a.hasMany('Event', 'buildingId'),
    users: a.hasMany('User', 'assignedBuildingId'),
  }).authorization(allow => [
    allow.groups(['admin', 'superUser']),
  ]),

  // Unit Model
  Unit: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    unitNumber: a.string().required(),
    status: a.enum(['sold', 'rented']),
    currentTenantId: a.id(),
    buildingId: a.id().required(),
    building: a.belongsTo('Building', 'buildingId'),
    tenant: a.belongsTo('User', 'currentTenantId'),
    tasks: a.hasMany('Task', 'unitId'),
    bills: a.hasMany('Bill', 'unitId'),
    maintenanceRequests: a.hasMany('MaintenanceRequest', 'unitId'),
  }).authorization(allow => [
    allow.groups(['admin']),
  ]).secondaryIndexes(index => [
    index('buildingId'),
  ]),

  // User Model
  User: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    name: a.string().required(),
    email: a.string().required(),
    phone: a.string(),
    role: a.enum(['superUser', 'admin', 'tenant', 'TaxiDepartmentUser']),
    assignedBuildingId: a.id(),
    unitId: a.id(),
    currentUnit: a.hasOne('Unit', 'currentTenantId'),
    assignedBuilding: a.belongsTo('Building', 'assignedBuildingId'),
    maintenanceRequests: a.hasMany('MaintenanceRequest', 'assignedTo'),
    createdMaintenanceRequests: a.hasMany('MaintenanceRequest', 'createdBy'),
    receivedMessages: a.hasMany('Message', 'recipientId'),
    sentMessages: a.hasMany('Message', 'createdBy'),
    departments: a.array(a.string()), // Departments the user manages (e.g., ['maintenance', 'rentals'])
    permissionLevels: a.json(), // JSON object defining permission levels within the complex
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin', 'superUser']),
  ]),

  // Task Model
  Task: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    description: a.string().required(),
    dueDate: a.date(),
    status: a.enum(['pending', 'inProgress', 'completed']),
    priority: a.enum(['low', 'medium', 'high']),
    assignedTo: a.id(),
    createdBy: a.id(),
    buildingId: a.id(),
    unitId: a.id(),
    unit: a.belongsTo('Unit', 'unitId'),
  }).authorization(allow => [
    allow.groups(['admin']),
    allow.owner(),
  ]),

  // MaintenanceRequest Model
  MaintenanceRequest: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    title: a.string().required(),
    description: a.string().required(),
    unitId: a.id().required(),
    status: a.enum(['open', 'inProgress', 'resolved']),
    priority: a.enum(['low', 'medium', 'high']),
    assignedTo: a.id(),
    createdBy: a.id().required(),
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    updatedAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    unit: a.belongsTo('Unit', 'unitId'),
    assignedStaff: a.belongsTo('User', 'assignedTo'),
    creator: a.belongsTo('User', 'createdBy'),
    escalationDeadline: a.datetime().required(), // SLA escalation deadline
    escalated: a.boolean().default(false), // Indicates if the request has been escalated
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]).secondaryIndexes(index => [
    index('unitId'),
    index('assignedTo'),
    index('priority'),
  ]),

  // Event Model
  Event: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    title: a.string().required(),
    description: a.string(),
    startDate: a.datetime().required(),
    endDate: a.datetime(),
    buildingId: a.id().required(),
    building: a.belongsTo('Building', 'buildingId'),
    createdBy: a.id().required(),
    attachments: a.hasMany('File', 'linkedToId'),
  }).authorization(allow => [
    allow.groups(['admin']).to(['create', 'update', 'read']), // Admin has full control
    allow.groups(['superUser']).to(['delete', 'read']), // SuperUser can delete and read
  ]).secondaryIndexes(index => [
    index('buildingId'),
  ]),

  // File Model
  File: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    fileName: a.string().required(),
    fileUrl: a.string().required(),
    type: a.string(),
    linkedToId: a.id(),
    linkedEvent: a.belongsTo('Event', 'linkedToId'),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin', 'superUser']),
  ]),

  // Notification Model
  Notification: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    message: a.string().required(),
    recipientId: a.id(),
    type: a.enum(['taskUpdate', 'paymentReminder', 'communityMessage', 'visitorApproval']),
    read: a.boolean().default(false),
    readBy: a.json(),
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin', 'superUser']),
  ]).secondaryIndexes(index => [
    index('recipientId'),
  ]),

  // Message Model
  Message: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    title: a.string().required(),
    content: a.string().required(),
    recipientId: a.id(),
    type: a.enum(['emergency', 'maintenance', 'general', 'listing']),
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    createdBy: a.id().required(),
    isRead: a.boolean().default(false),
    readBy: a.json(),
    linkedRentalUnitId: a.id(),
    recipient: a.belongsTo('User', 'recipientId'),
    sender: a.belongsTo('User', 'createdBy'),
  }).authorization(allow => [
    allow.groups(['admin', 'ListingDepartmentUser']).to(['create', 'read', 'update']),
    allow.owner(),
  ]).secondaryIndexes(index => [
    index('recipientId'),
  ]),

  // Vehicle Model
  Vehicle: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    licensePlate: a.string().required(),
    model: a.string(),
    color: a.string(),
    buildingId: a.id(),
    status: a.enum(['pending', 'approved', 'rejected']),
    registeredAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    approvedBy: a.id(),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin', 'superUser']),
  ]).secondaryIndexes(index => [
    index('tenantId'),
    index('status'),
  ]),

  // Bill Model
  Bill: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    amount: a.float().required(),
    dueDate: a.datetime().required(),
    status: a.enum(['unpaid', 'paid']),
    unitId: a.id().required(),
    unit: a.belongsTo('Unit', 'unitId'),
  }).authorization(allow => [
    allow.groups(['admin']),
    allow.owner(),
  ]),

  // AuditTrail Model
  AuditTrail: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    userId: a.id().required(), // Foreign key for user
    action: a.string().required(), // Action performed
    resourceType: a.string().required(), // Type of resource affected
    resourceId: a.id(), // ID of the affected resource
    relatedTable: a.string(), // Name of the table involved
    relatedResource: a.json(), // Additional details of the related resource
    description: a.string(), // Description of the activity
    timestamp: a.datetime().default('1970-01-01T00:00:00.000Z'), // When the action occurred
  }).authorization(allow => [
    allow.groups(['superUser']),
  ]),

  // Report Model
  Report: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    title: a.string().required(),
    description: a.string(),
    type: a.enum(['usage', 'maintenance', 'financial']),
    generatedBy: a.id().required(), // Creator user
    generatedAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    data: a.json(),
  }).authorization(allow => [
    allow.groups(['superUser']), // Super users manage reports
    allow.groups(['admin']).to(['read']),
  ]),

  // ListingDepartmentUser Model
  ListingDepartmentUser: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    name: a.string().required(),
    email: a.string().required(),
    phone: a.string(),
    assignedBy: a.id().required(), // Reference to the admin or superUser who created this user
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
  }).authorization(allow => [
    allow.groups(['admin', 'superUser']).to(['create', 'read', 'update', 'delete']), // Only admins and superUsers manage these users
  ]),

  // RentalUnit Model
  RentalUnit: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    unitNumber: a.string().required(),
    description: a.string(),
    status: a.enum(['available', 'reserved']),
    createdBy: a.id().required(), // Reference to ListingDepartmentUser
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'), // For auditing
    photos: a.hasMany('Photo', 'rentalUnitId'), // Link to the Photo model
    messages: a.hasMany('Message', 'linkedRentalUnitId'),
    maintenanceRequests: a.hasMany('MaintenanceRequest', 'linkedRentalUnitId'),
  }).authorization(allow => [
    allow.groups(['admin', 'ListingDepartmentUser']).to(['create', 'update', 'read']),
  ]).secondaryIndexes(index => [
    index('status'),
    index('unitNumber'),
  ]),
  

  // Photo Model
  Photo: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    rentalUnitId: a.id().required(), // Foreign key to RentalUnit
    photoUrl: a.string().required(), // URL of the photo
    description: a.string(), // Optional description of the photo
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'), // For auditing
  }).authorization(allow => [
    allow.groups(['admin', 'ListingDepartmentUser']).to(['create', 'update', 'read']),
  ]),

  // ActivityLog Model
  ActivityLog: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    performedBy: a.id().required(), // Reference to the user who performed the action
    actionType: a.enum(['login', 'create', 'update', 'delete', 'systemEvent']), // Type of action
    resourceType: a.string(), // Type of resource affected (e.g., 'User', 'Building')
    resourceId: a.id(), // ID of the affected resource
    description: a.string(), // Description of the activity
    timestamp: a.datetime().default('1970-01-01T00:00:00.000Z'), // When the action occurred
  }).authorization(allow => [
    allow.groups(['admin', 'superUser']).to(['read', 'update']), // Only admins and superUsers can read and update logs
  ]),

  // DashboardNotification Model
  DashboardNotification: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    message: a.string().required(), // Notification content
    severity: a.enum(['info', 'warning', 'critical']), // Severity level
    createdBy: a.id(), // Admin who created the notification (optional)
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    acknowledgedBy: a.array(a.id()), // Users who acknowledged the notification
  }).authorization(allow => [
    allow.groups(['admin', 'superUser']).to(['read', 'update']), // Admins and superUsers manage notifications
  ]),

  // CustomRole Model
  CustomRole: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    name: a.string().required(), // Role name
    permissions: a.json().required().default({
      taxiRequestManagement: ["create", "update", "read"] // Taxi-related permissions
    }), // JSON defining allowed actions
    assignedTo: a.hasMany('User', 'roleId'), // Users assigned to this role
  }).authorization(allow => [
    allow.groups(['admin', 'superUser']).to(['create', 'update', 'read', 'delete']),
  ]),

  // SystemSetting Model
  SystemSetting: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    key: a.string().required(), // Setting name (e.g., 'defaultMaintenancePriority')
    value: a.json().required(), // JSON value for the setting
    updatedAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
  }).authorization(allow => [
    allow.groups(['admin', 'superUser']).to(['read', 'update']), // Restricted to admins
  ]),

  // Lease Model
  Lease: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    residentId: a.id().required(), // Reference to the resident
    unitId: a.id().required(), // The unit being leased
    startDate: a.date().required(),
    endDate: a.date(),
    status: a.enum(['active', 'expired']),
  }).authorization(allow => [
    allow.owner(), // Residents can view their own leases
    allow.groups(['admin']).to(['read', 'update']), // Admins can manage leases
  ]),

  // Visitor Model
  Visitor: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    residentId: a.id().required(), // Reference to the resident who invited the visitor
    name: a.string().required(), // Visitor's name
    visitDate: a.date().required(),
    qrCode: a.string().required(), // QR code for gate access
  }).authorization(allow => [
    allow.owner(), // Only the resident can create and view their visitors
    allow.groups(['admin', 'superUser']).to(['read']), // Admins can view visitor logs
  ]),

  // ContactRequest Model
  ContactRequest: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    rentalUnitId: a.id().required(), // Reference to the RentalUnit
    requesterName: a.string().required(), // Name of the person making the request
    requesterEmail: a.string().required(), // Contact email of the requester
    requesterPhone: a.string(), // Optional phone number
    message: a.string(), // Inquiry message
    status: a.enum(['new', 'inProgress', 'resolved']), // Status of the request
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'), // Timestamp for request creation
    updatedAt: a.datetime().default('1970-01-01T00:00:00.000Z'), // Timestamp for last update
  }).authorization(allow => [
    allow.groups(['admin', 'ListingDepartmentUser']).to(['create', 'read', 'update']), // Admin and ListingDepartmentUser can manage requests
    allow.owner().to(['read']), // Requester can view their own request
  ]),

  // TaxiRequest Model
  TaxiRequest: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    residentId: a.id().required(), // Reference to the resident
    pickupLocation: a.string().required(),
    destination: a.string().required(),
    pickupTime: a.datetime().required(),
    status: a.enum(['pending', 'assigned', 'completed', 'cancelled']),
    assignedDepartmentId: a.id(), // Department managing the request
    assignedBy: a.id(), // Admin or department user assigning the request
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    updatedAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    notes: a.array(a.string()), // Admin notes or instructions
  }).authorization(allow => [
    allow.owner().to(['create', 'read']),
    allow.groups(['admin', 'TaxiDepartmentUser']).to(['create', 'read', 'update']),
  ]).secondaryIndexes(index => [
    index('status'),
    index('pickupLocation'),
  ]),

  // BulkOperation Model
  BulkOperation: a.model({
    tenantId: a.id().required(), // Multi-tenancy support
    performedBy: a.id().required(), // User who initiated the bulk operation
    operationType: a.enum(['import', 'export', 'update']), // Type of bulk operation
    targetModel: a.string().required(), // Model being operated on (e.g., 'Unit')
    fileUrl: a.string(), // URL for uploaded file (if import/export)
    status: a.enum(['inProgress', 'completed', 'failed']),
    errors: a.array(a.string()), // Errors encountered (if any)
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    completedAt: a.datetime(), // Timestamp when the operation was completed
  }).authorization(allow => [
    allow.groups(['admin']), // Only admins can manage bulk operations
  ]),
});

// Export the data schema definition
export const data = defineData({ schema });
