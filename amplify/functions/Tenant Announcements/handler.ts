import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
const MESSAGE_TABLE_NAME = process.env.MESSAGE_TABLE_NAME!;

export const handler = async (event: any) => {
  const { title, content, type = 'general', recipientId = null, createdBy } = event;

  if (!title || !content || !createdBy) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Title, content, and createdBy are required' }),
    };
  }

  try {
    const message = {
      id: `${Date.now()}`, // Unique ID
      title,
      content,
      type,
      recipientId, // Null for broadcast
      createdBy,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    await db.send(
      new PutCommand({
        TableName: MESSAGE_TABLE_NAME,
        Item: message,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Announcement broadcast successfully' }),
    };
  } catch (error) {
    console.error('Error broadcasting announcement:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
