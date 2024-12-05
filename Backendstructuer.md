Property Management System Data Models Overview
This document provides a comprehensive overview of the data models used in our property management system. It is designed for individuals without a technical background to understand the structure, purpose, and relationships of the various components within the system.

Introduction
Our property management system is a comprehensive platform designed to streamline the management of buildings, units, tenants, staff, and all associated activities. The system supports multi-tenancy, meaning it can manage data for multiple clients or organizations within the same application securely and efficiently.

The system is built around several key data models, each representing a different aspect of property management. Understanding these models will help you navigate the system more effectively and leverage its full capabilities.

Key Data Models
Below is a detailed explanation of each data model, including its purpose, main fields (attributes), relationships with other models, and access permissions.

1. Building
Purpose: Represents a physical building or property managed within the system.

Main Fields:

Tenant ID: Identifier for the organization or client.
Name: Name of the building.
Address: Physical address of the building.
Tower Count: Number of towers within the building complex.
Floors Per Tower: Number of floors in each tower.
Units Per Floor: Number of units available on each floor.
Relationships:

Units: A building contains multiple units.
Events: Events can be scheduled for a building.
Users: Staff or administrators can be assigned to a building.
Access Permissions:

Accessible by users with Admin or SuperUser roles.
2. Unit
Purpose: Represents an individual unit or apartment within a building.

Main Fields:

Tenant ID: Identifier for the organization or client.
Unit Number: Unique number or identifier for the unit.
Status: Indicates if the unit is sold or rented.
Current Tenant ID: Identifier for the tenant currently occupying the unit.
Building ID: Identifier for the building the unit belongs to.
Relationships:

Building: Each unit is part of a building.
Tenant (User): A unit may have a tenant assigned.
Tasks: Maintenance or other tasks associated with the unit.
Bills: Financial obligations linked to the unit.
Maintenance Requests: Service requests made for the unit.
Access Permissions:

Accessible by users with Admin role.
3. User
Purpose: Represents individuals who interact with the system, such as tenants, staff, or administrators.

Main Fields:

Tenant ID: Identifier for the organization or client.
Name: Full name of the user.
Email: Contact email address.
Phone: Contact phone number.
Role: Role of the user (SuperUser, Admin, or Tenant).
Assigned Building ID: If applicable, the building the user is assigned to.
Unit ID: If applicable, the unit the user occupies.
Relationships:

Current Unit: The unit currently occupied by the user.
Assigned Building: The building the user is responsible for.
Maintenance Requests: Requests the user has created or is assigned to.
Messages: Communications sent or received by the user.
Access Permissions:

Users can access their own information (Owner access).
Accessible by users with Admin or SuperUser roles.
4. Task
Purpose: Represents tasks or activities that need to be completed, often related to maintenance or administration.

Main Fields:

Tenant ID: Identifier for the organization or client.
Description: Details about the task.
Due Date: Deadline for task completion.
Status: Current status (pending, inProgress, completed).
Priority: Importance level (low, medium, high).
Assigned To: Identifier for the user responsible for the task.
Created By: Identifier for the user who created the task.
Building ID/Unit ID: Location associated with the task.
Relationships:

Unit: The unit the task is associated with, if applicable.
Access Permissions:

Accessible by users with Admin role and by the user the task is assigned to (Owner access).
5. MaintenanceRequest
Purpose: Represents a request for maintenance services, typically submitted by a tenant.

Main Fields:

Tenant ID: Identifier for the organization or client.
Title: Brief summary of the request.
Description: Detailed explanation of the issue.
Unit ID: Identifier for the unit needing maintenance.
Status: Current status (open, inProgress, resolved).
Priority: Importance level (low, medium, high).
Assigned To: Identifier for the staff member handling the request.
Created By: Identifier for the user who submitted the request.
Created At/Updated At: Timestamps for tracking.
Relationships:

Unit: The unit associated with the request.
Assigned Staff (User): Staff member assigned to address the request.
Creator (User): Tenant who submitted the request.
Access Permissions:

Users can access their own maintenance requests (Owner access).
Accessible by users with Admin role.
6. Event
Purpose: Represents events or activities scheduled within a building or community.

Main Fields:

Tenant ID: Identifier for the organization or client.
Title: Name of the event.
Description: Details about the event.
Start Date/End Date: Duration of the event.
Building ID: Identifier for the building where the event is held.
Created By: Identifier for the user who created the event.
Relationships:

Building: The building associated with the event.
Attachments (Files): Files related to the event (e.g., flyers, images).
Access Permissions:

Admins: Can create, update, and read events.
SuperUsers: Can delete and read events.
7. File
Purpose: Represents files or documents uploaded to the system.

Main Fields:

Tenant ID: Identifier for the organization or client.
File Name: Name of the file.
File URL: Location where the file is stored.
Type: Type or format of the file.
Linked To ID: Identifier for the entity the file is associated with (e.g., an event).
Relationships:

Linked Event: The event the file is associated with, if applicable.
Access Permissions:

Users can access their own files (Owner access).
Accessible by users with Admin or SuperUser roles.
8. Notification
Purpose: Represents alerts or updates sent to users.

Main Fields:

Tenant ID: Identifier for the organization or client.
Message: Content of the notification.
Recipient ID: Identifier for the user receiving the notification.
Type: Category of notification (taskUpdate, paymentReminder, communityMessage).
Read: Indicates if the notification has been read.
Read By: List of users who have read the notification.
Created At: Timestamp of when the notification was created.
Access Permissions:

Users can access their own notifications (Owner access).
Accessible by users with Admin or SuperUser roles.
9. Message
Purpose: Represents messages exchanged between users within the system.

Main Fields:

Tenant ID: Identifier for the organization or client.
Title: Subject of the message.
Content: Body of the message.
Recipient ID: Identifier for the message recipient.
Type: Category of message (emergency, maintenance, general).
Created At: Timestamp of when the message was sent.
Created By: Identifier for the sender.
Is Read: Indicates if the message has been read.
Read By: List of users who have read the message.
Relationships:

Recipient (User): The user receiving the message.
Sender (User): The user who sent the message.
Access Permissions:

Admins and SuperUsers: Can create, read, and update messages.
Users can access messages they have sent or received (Owner access).
10. Vehicle
Purpose: Represents vehicles registered within the property, typically by tenants or staff.

Main Fields:

Tenant ID: Identifier for the organization or client.
License Plate: Vehicle's license plate number.
Model: Make and model of the vehicle.
Color: Color of the vehicle.
Building ID: Identifier for the building where the vehicle is registered.
Status: Registration status (pending, approved, rejected).
Registered At: Timestamp of when the vehicle was registered.
Approved By: Identifier for the user who approved the registration.
Access Permissions:

Users can access their own vehicle information (Owner access).
Accessible by users with Admin or SuperUser roles.
11. Bill
Purpose: Represents financial obligations, such as rent or maintenance fees, assigned to tenants.

Main Fields:

Tenant ID: Identifier for the organization or client.
Amount: Monetary amount due.
Due Date: Deadline for payment.
Status: Payment status (unpaid, paid).
Unit ID: Identifier for the unit the bill is associated with.
Relationships:

Unit: The unit the bill is associated with.
Access Permissions:

Accessible by users with Admin role.
Users can access their own bills (Owner access).
12. AuditTrail
Purpose: Tracks actions performed within the system for accountability and security.

Main Fields:

Tenant ID: Identifier for the organization or client.
User ID: Identifier for the user who performed the action.
Action: Description of the action taken.
Resource Type: Type of resource affected (e.g., User, Bill, MaintenanceRequest).
Resource ID: Identifier for the affected resource.
Timestamp: When the action occurred.
Details: Additional information about the action.
Access Permissions:

Accessible only by users with SuperUser role.
13. Report
Purpose: Represents generated reports for analysis and record-keeping.

Main Fields:

Tenant ID: Identifier for the organization or client.
Title: Name of the report.
Description: Brief explanation of the report's content.
Type: Category of report (usage, maintenance, financial).
Generated By: Identifier for the user who created the report.
Generated At: Timestamp of when the report was generated.
Data: Content or findings of the report.
Access Permissions:

Accessible by users with SuperUser role (full access).
Users with Admin role can read reports.
Access Control Summary
Owner Access: Users can access and manage their own data.
Admin Role: Users with Admin role have elevated permissions, including managing buildings, units, and tasks.
SuperUser Role: Users with SuperUser role have the highest level of access, including system-wide management and sensitive data like audit trails and reports.
Group Permissions: Access is also managed based on group memberships (e.g., admin, superUser).
Relationships Between Models
Understanding how these models interact is crucial for grasping the system's workflow:

Buildings contain multiple Units.
Units are occupied by Users (tenants).
Users can submit Maintenance Requests for their Units.
Maintenance Requests can generate Tasks assigned to staff (Users).
Events are associated with Buildings and can have related Files (attachments).
Messages are exchanged between Users.
Vehicles are registered by Users and associated with Buildings.
Bills are generated for Units and assigned to Users (tenants).
AuditTrails record actions performed by Users.
Reports are generated by Users with appropriate permissions.
Multi-Tenancy Support
All models include a Tenant ID field to support multi-tenancy. This ensures that data is isolated between different organizations or clients using the system, maintaining privacy and security.

Conclusion
This document provides a foundational understanding of the data models within our property management system. By familiarizing yourself with these components, you can better navigate the system and utilize its features to their fullest potential.

If you have any questions or require further clarification on any aspect of the system, please feel free to reach out to the support team or your system administrator.

Glossary
Admin: A user role with permissions to manage certain aspects of the system, such as buildings, units, and tasks.
SuperUser: A user role with the highest level of access, capable of overseeing the entire system.
Tenant: In this context, refers to both the occupants of units and the organizations or clients using the system.
Owner Access: Permissions that allow a user to access and manage their own data and related resources.
Multi-Tenancy: A system architecture where a single instance of software serves multiple clients or organizations.


Note: This overview is intended for informational purposes and may not cover every detail or exception within the system. Always refer to official documentation or contact system administrators for specific guidance.