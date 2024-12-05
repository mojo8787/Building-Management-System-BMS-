export const handler = async (event: any) => {
    console.log('Registering vehicle:', event);
    // Logic to register a vehicle
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Vehicle registered successfully' }),
    };
  };
  