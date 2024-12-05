export const handler = async (event: any) => {
    console.log('Event received:', event);
    // Logic to generate a QR code
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'QR code generated successfully' }),
    };
  };
  