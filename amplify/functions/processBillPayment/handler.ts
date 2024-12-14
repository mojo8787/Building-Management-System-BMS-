export const handler = async (event: any) => {
    console.log('Processing bill payment:', event);
    // Logic to handle bill payment
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Bill payment processed successfully' }),
    };
  };
  