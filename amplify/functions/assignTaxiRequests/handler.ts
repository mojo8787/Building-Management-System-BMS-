import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
const TAXI_REQUEST_TABLE_NAME = process.env.TAXI_REQUEST_TABLE_NAME!;

export const handler = async (event: any) => {
  const { requestId, assignedDepartmentId, assignedBy } = event;

  if (!requestId || !assignedDepartmentId || !assignedBy) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields' }),
    };
  }

  try {
    await db.send(
      new UpdateCommand({
        TableName: TAXI_REQUEST_TABLE_NAME,
        Key: { id: requestId },
        UpdateExpression: 'SET assignedDepartmentId = :assignedDepartmentId, assignedBy = :assignedBy, status = :status, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':assignedDepartmentId': assignedDepartmentId,
          ':assignedBy': assignedBy,
          ':status': 'assigned',
          ':updatedAt': new Date().toISOString(),
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Taxi request assigned successfully' }),
    };
  } catch (error) {
    console.error('Error assigning taxi request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
