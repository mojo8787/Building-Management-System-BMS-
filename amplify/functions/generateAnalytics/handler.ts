import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

const MAINTENANCE_TABLE_NAME = process.env.MAINTENANCE_TABLE_NAME!;
const BILL_TABLE_NAME = process.env.BILL_TABLE_NAME!;

export const handler = async (event: any) => {
  const { reportType } = event;

  try {
    let data;

    if (reportType === 'maintenance') {
      const maintenanceData = await db.send(
        new ScanCommand({ TableName: MAINTENANCE_TABLE_NAME })
      );
      data = maintenanceData.Items?.map((item: any) => ({
        id: item.id,
        title: item.title,
        status: item.status,
        assignedTo: item.assignedTo,
      }));
    } else if (reportType === 'financial') {
      const billData = await db.send(
        new ScanCommand({ TableName: BILL_TABLE_NAME })
      );
      data = billData.Items?.map((item: any) => ({
        id: item.id,
        amount: item.amount,
        status: item.status,
        dueDate: item.dueDate,
      }));
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid report type' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reportType, data }),
    };
  } catch (error) {
    console.error('Error generating analytics:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
