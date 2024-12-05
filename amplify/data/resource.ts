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
    role: a.enum(['superUser', 'admin', 'tenant']),
    assignedBuildingId: a.id(),
    unitId: a.id(),
    currentUnit: a.hasOne('Unit', 'currentTenantId'),
    assignedBuilding: a.belongsTo('Building', 'assignedBuildingId'),
    maintenanceRequests: a.hasMany('MaintenanceRequest', 'assignedTo'),
    createdMaintenanceRequests: a.hasMany('MaintenanceRequest', 'createdBy'),
    receivedMessages: a.hasMany('Message', 'recipientId'),
    sentMessages: a.hasMany('Message', 'createdBy'),
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
    type: a.enum(['taskUpdate', 'paymentReminder', 'communityMessage']),
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
    type: a.enum(['emergency', 'maintenance', 'general']),
    createdAt: a.datetime().default('1970-01-01T00:00:00.000Z'),
    createdBy: a.id().required(),
    isRead: a.boolean().default(false),
    readBy: a.json(),
    recipient: a.belongsTo('User', 'recipientId'),
    sender: a.belongsTo('User', 'createdBy'),
  }).authorization(allow => [
    allow.groups(['admin', 'superUser']).to(['create', 'read', 'update']),
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
    action: a.string().required(),
    resourceType: a.string().required(),
    resourceId: a.id(),
    timestamp: a.datetime().default('1970-01-01T00:00:00.000Z'),
    details: a.json(),
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
});

// Export the data schema definition
export const data = defineData({ schema });
