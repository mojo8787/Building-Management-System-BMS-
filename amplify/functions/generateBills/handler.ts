export const handler = async (event: any) => {
    console.log('Generating bills:', event);
    // Logic to generate bills
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Bills generated successfully' }),
    };
  };
  