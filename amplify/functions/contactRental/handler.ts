export const handler = async (event: any) => {
    console.log('Handling rental contact request:', event);
    // Logic to handle rental contact
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Rental contact request handled successfully' }),
    };
  };
  