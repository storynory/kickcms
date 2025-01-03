export async function GET({ locals }) {
    try {
      // Fetch images
      const result = await locals.pb.collection('images').getList(1, 5, {
        sort: '-created',
      });
  
      console.log('images server.js totalItems:', result.totalItems);
  
      // Extract the items array to match the getFullList format
      const images = result;
  
      // Get user information from the auth store
      const user = locals.pb.authStore.isValid ? locals.pb.authStore.model : null;
  
      // Return JSON response with images and user data
      return new Response(
        JSON.stringify({ images, user }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Failed to fetch images:', error);
  
      return new Response(
        JSON.stringify({ error: 'Failed to fetch images' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  