export async function load({ fetch}) {
   
  
    try {
        const response = await fetch('/socket/dashboard');
 
     
        if (!response.ok) {
            throw new Error(`Failed to fetch posts on dashboard: ${response.status}`);
        }

        // Destructure the posts from the response JSON
        let { posts } = await response.json();
          
     
     
        // Export data in the consistent format
        return { posts };
    } catch (error) {
        console.error('Failed to load posts:', error);

        // Return an empty array in case of an error
     
        return {images: []  };
    }
}
