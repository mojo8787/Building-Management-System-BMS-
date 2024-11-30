import { defineData, a } from '@aws-amplify/backend';

const schema = a.schema({
  // Building Model
  Building: a.model({
    name: a.string().required(),
    address: a.string().required(),
    towerCount: a.integer().required(),
    floorsPerTower: a.integer().required(),
    unitsPerFloor: a.integer().required(),
    units: a.hasMany('Unit', 'buildingId'),
    events: a.hasMany('Event', 'buildingId'),
  }).authorization(allow => [
    allow.owner(),
    allow.publicApiKey().to(['read']),
  ]),

  // Unit Model
  Unit: a.model({
    unitNumber: a.string().required(),
    status: a.enum(['sold', 'rented']),
    currentTenantId: a.id(),
    buildingId: a.id().required(),
    building: a.belongsTo('Building', 'buildingId'),
    tenant: a.belongsTo('User', 'currentTenantId'),
    tasks: a.hasMany('Task', 'unitId'),
    bills: a.hasMany('Bill', 'unitId'),
    vehicles: a.hasMany('Vehicle', 'unitId'),
    rentals: a.hasMany('Rental', 'unitId'),
    maintenanceRequests: a.hasMany('MaintenanceRequest', 'unitId'),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]).secondaryIndexes(index => [
    index('buildingId')
  ]),

  // User Model
  User: a.model({
    name: a.string().required(),
    email: a.string().required(),
    phone: a.string(),
    role: a.enum(['superUser', 'admin', 'tenant']),
    assignedBuildingId: a.id(),
    unitId: a.id(),
    unit: a.belongsTo('Unit', 'unitId'),
    assignedBuilding: a.belongsTo('Building', 'assignedBuildingId'),
    assignedTasks: a.hasMany('Task', 'assignedTo'),
    createdTasks: a.hasMany('Task', 'createdBy'),
    sentMessages: a.hasMany('Message', 'senderId'),
    receivedMessages: a.hasMany('Message', 'recipientId'),
    assignedMaintenanceRequests: a.hasMany('MaintenanceRequest', 'assignedTo'),
    createdMaintenanceRequests: a.hasMany('MaintenanceRequest', 'createdBy'),
    createdEvents: a.hasMany('Event', 'createdBy'),
    eventRegistrations: a.hasMany('EventRegistration', 'userId'),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]),

  // Task Model
  Task: a.model({
    description: a.string().required(),
    dueDate: a.date(),
    status: a.enum(['pending', 'inProgress', 'completed']),
    priority: a.enum(['low', 'medium', 'high']),
    assignedTo: a.id(), // Change to id to reference a user
    createdBy: a.id(),
    buildingId: a.id(),
    unitId: a.id(),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]),

  // File Model
  File: a.model({
    fileName: a.string().required(),
    fileUrl: a.string().required(),
    type: a.string(),
    linkedToId: a.id(),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]),

  // Notification Model
  Notification: a.model({
    message: a.string().required(),
    recipientId: a.id(),
    type: a.enum(['taskUpdate', 'paymentReminder', 'communityMessage']),
    read: a.boolean().default(false),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]),

  // QR Code Model
  QRCode: a.model({
    qrId: a.string().required(),
    residentId: a.id().required(),
    expiration: a.date().required(),
    status: a.enum(['active', 'expired']),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]),

  // Vehicle Model
  Vehicle: a.model({
    plateNumber: a.string().required(),
    unitId: a.id().required(),
    isApproved: a.boolean().default(false),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]),

  // Rental Listing Model
  Rental: a.model({
    title: a.string().required(),
    description: a.string().required(),
    price: a.float().required(),
    unitId: a.id().required(),
    photos: a.json(),
    contactMethod: a.enum(['email', 'phone']),
    available: a.boolean().default(true),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
    allow.publicApiKey().to(['read']),
  ]),

  // Bill Model
  Bill: a.model({
    billId: a.string().required(),
    unitId: a.id().required(),
    residentId: a.id().required(),
    type: a.enum(['water', 'electricity', 'gas', 'internet']),
    amount: a.float().required(),
    dueDate: a.date().required(),
    status: a.enum(['pending', 'paid']),
    paymentDate: a.date(),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]),

  // Message Model
  Message: a.model({
    senderId: a.id().required(),
    recipientId: a.id().required(),
    content: a.string().required(),
    timestamp: a.datetime().required().default(() => new Date()),
    sender: a.belongsTo('User', 'senderId'),
    recipient: a.belongsTo('User', 'recipientId'),
    status: a.enum(['sent', 'delivered', 'read']),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]).secondaryIndexes(index => [
    index('senderId'),
    index('recipientId')
  ]),

  // MaintenanceRequest Model
  MaintenanceRequest: a.model({
    title: a.string().required(),
    description: a.string().required(),
    unitId: a.id().required(),
    status: a.enum(['open', 'inProgress', 'resolved']),
    priority: a.enum(['low', 'medium', 'high']),
    assignedTo: a.id(),
    createdBy: a.id().required(),
    createdAt: a.datetime().required().default(() => new Date()),
    updatedAt: a.datetime().required().default(() => new Date()),
    unit: a.belongsTo('Unit', 'unitId'),
    assignedStaff: a.belongsTo('User', 'assignedTo'),
    creator: a.belongsTo('User', 'createdBy'),
    attachments: a.hasMany('File', 'linkedToId'),
    comments: a.hasMany('MaintenanceComment', 'requestId'),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]).secondaryIndexes(index => [
    index('unitId'),
    index('assignedTo')
  ]),

  // MaintenanceComment Model for tracking request updates
  MaintenanceComment: a.model({
    requestId: a.id().required(),
    content: a.string().required(),
    createdBy: a.id().required(),
    createdAt: a.datetime().required().default(() => new Date()),
    request: a.belongsTo('MaintenanceRequest', 'requestId'),
    author: a.belongsTo('User', 'createdBy'),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]),

  // Event Model
  Event: a.model({
    title: a.string().required(),
    description: a.string(),
    startDate: a.datetime().required(),
    endDate: a.datetime(),
    location: a.string(),
    buildingId: a.id().required(),
    capacity: a.integer(),
    status: a.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
    createdBy: a.id().required(),
    attendanceCount: a.integer().default(0),
    feedback: a.json(),
    analyticsData: a.json(),
    building: a.belongsTo('Building', 'buildingId'),
    creator: a.belongsTo('User', 'createdBy'),
    attachments: a.hasMany('File', 'linkedToId'),
    registrations: a.hasMany('EventRegistration', 'eventId'),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']).to(['create', 'update', 'read']),
    allow.groups(['superUser']).to(['delete']),
    allow.publicApiKey().to(['read']),
  ]).secondaryIndexes(index => [
    index('buildingId')
  ]),

  // EventRegistration Model for managing participants
  EventRegistration: a.model({
    eventId: a.id().required(),
    userId: a.id().required(),
    status: a.enum(['registered', 'attended', 'cancelled']),
    registeredAt: a.datetime().required().default(() => new Date()),
    event: a.belongsTo('Event', 'eventId'),
    user: a.belongsTo('User', 'userId'),
  }).authorization(allow => [
    allow.owner(),
    allow.groups(['admin']),
  ]).secondaryIndexes(index => [
    index('eventId'),
    index('userId')
  ]),

  // ActivityLog Model
  ActivityLog: a.model({
    action: a.string().required(),      // e.g., 'LOGIN', 'CREATE_REQUEST'
    resourceType: a.string().required(), // e.g., 'Task', 'MaintenanceRequest'
    resourceId: a.id(),                 // ID of the affected resource
    performedBy: a.id().required(),     // User who performed the action
    timestamp: a.datetime().required().default(() => new Date()),
    performer: a.belongsTo('User', 'performedBy'), // Added relationship to User
  }).authorization(allow => [
    allow.groups(['admin']), // Only admins can view logs
  ]).secondaryIndexes(index => [
    index('performedBy')    // Added index for querying by user
  ]),

  // Report Model
  Report: a.model({
    title: a.string().required(),
    description: a.string(),
    type: a.enum(['usage', 'maintenance', 'financial', 'activity']),
    generatedBy: a.id().required(),
    generatedAt: a.datetime().required().default(() => new Date()),
    data: a.json().required(),
    buildingId: a.id(), // Optional: for building-specific reports
    dateRange: a.json(), // Store start and end dates for the report period
    generator: a.belongsTo('User', 'generatedBy'),
    building: a.belongsTo('Building', 'buildingId'),
  }).authorization(allow => [
    allow.groups(['superUser']).to(['create', 'read', 'delete']),
    allow.groups(['admin']).to(['read']),
  ]).secondaryIndexes(index => [
    index('buildingId'),
    index('generatedBy')
  ]),

  // BroadcastNotification Model
  BroadcastNotification: a.model({
    title: a.string().required(),
    message: a.string().required(),
    recipientType: a.enum(['all', 'tenants', 'admins']),
    priority: a.enum(['low', 'medium', 'high']),
    buildingId: a.id(), // Optional: for building-specific broadcasts
    sentBy: a.id().required(),
    timestamp: a.datetime().required().default(() => new Date()),
    expiresAt: a.datetime(), // Optional expiration date
    sender: a.belongsTo('User', 'sentBy'),
    building: a.belongsTo('Building', 'buildingId'),
  }).authorization(allow => [
    allow.groups(['superUser']).to(['create', 'read', 'delete']),
    allow.groups(['admin']).to(['create', 'read']),
    allow.public().to(['read']), // Allow recipients to read broadcasts
  ]).secondaryIndexes(index => [
    index('buildingId'),
    index('sentBy')
  ]),
});

export const data = defineData({ schema });
