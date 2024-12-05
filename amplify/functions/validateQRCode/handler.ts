export const handler = async (event: any) => {
    console.log('Validating QR code:', event);
    // Logic to validate QR code
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'QR code is valid' }),
    };
  };
  