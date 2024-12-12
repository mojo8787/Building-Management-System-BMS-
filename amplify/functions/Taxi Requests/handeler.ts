import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
const TAXI_REQUEST_TABLE_NAME = process.env.TAXI_REQUEST_TABLE_NAME!;

export const handler = async (event: any) => {
  const { residentId, pickupLocation, destination, pickupTime } = event;

  if (!residentId || !pickupLocation || !destination || !pickupTime) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'All fields are required.' }),
    };
  }

  const now = new Date();
  const pickupDate = new Date(pickupTime);

  if (pickupDate < now) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Pickup time must be in the future.' }),
    };
  }

  // Validate destination (simple example, replace with your logic)
  const validDestinations = ['Airport', 'City Center', 'Hotel'];
  if (!validDestinations.includes(destination)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid destination.' }),
    };
  }

  try {
    const taxiRequest = generateTaxiRequest(residentId, pickupLocation, destination, pickupTime);

    await db.send(
      new PutCommand({
        TableName: TAXI_REQUEST_TABLE_NAME,
        Item: taxiRequest,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Taxi request validated and created.', taxiRequest }),
    };
  } catch (error) {
    console.error('Error creating taxi request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
