import PocketBase from 'pocketbase';
import { pb, userState,imageresize  } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
  
export async function GET({ fetch }) {


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
