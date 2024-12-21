import PocketBase from 'pocketbase';

export async function GET({ fetch }) {
  const pb = new PocketBase('http://127.0.0.1:8090');

  try {
    // Fetch the images using PocketBase and pass fetch explicitly
    const images = await pb.collection('images').getFullList(
      {
        sort: '-created',
      },
      { fetch } // Pass the custom fetch function here
    );

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
