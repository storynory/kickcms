export async function GET({ locals }) {
    try {
      const result = await locals.pb.collection('posts').getList(1, 5, {
          sort: '-created',
          expand: 'featuredImage', // Include full details of the featured image
      });
     console.log("posts server.js totalItems:", result.totalItems)
      // Extract the items array to match the getFullList format
      const posts = result.items;
      
  
      // Return JSON response
      return new Response(JSON.stringify({ posts }), {
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
  