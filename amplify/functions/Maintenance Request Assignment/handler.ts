import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
const MAINTENANCE_TABLE_NAME = process.env.MAINTENANCE_TABLE_NAME!;
const USER_TABLE_NAME = process.env.USER_TABLE_NAME!;

export const handler = async (event: any) => {
  const { requestId, assignedTo, priority } = event;

  if (!requestId || !assignedTo) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Request ID and assigned staff ID are required' }),
    };
  }

  try {
    // Check if assigned staff exists
    const user = await db.send(
      new GetCommand({
        TableName: USER_TABLE_NAME,
        Key: { id: assignedTo },
      })
    );

    if (!user.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Assigned staff not found' }),
      };
    }

    // Update maintenance request with assigned staff
    await db.send(
      new UpdateCommand({
        TableName: MAINTENANCE_TABLE_NAME,
        Key: { id: requestId },
        UpdateExpression: 'SET assignedTo = :assignedTo, priority = :priority',
        ExpressionAttributeValues: {
          ':assignedTo': assignedTo,
          ':priority': priority || 'medium',
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Maintenance request assigned successfully' }),
    };
  } catch (error) {
    console.error('Error assigning maintenance request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
