export async function GET({ locals }) {
  try {
    const result = await locals.pb.collection('images').getList(1, 5, {
        sort: '-created',
    });
   console.log("images server.js totalItems:", result.totalItems)
    // Extract the items array to match the getFullList format
    const images = result;

    // Return JSON response
    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to fetch images:', error);

    return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
