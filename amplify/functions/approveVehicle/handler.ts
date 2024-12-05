export const handler = async (event: any) => {
    console.log('Approving vehicle:', event);
    // Logic to approve a vehicle
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Vehicle approved successfully' }),
    };
  };
  