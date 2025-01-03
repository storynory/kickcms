export async function load({ fetch}) {
   
  
    try {
        const response = await fetch('/dashboard');
 
     
        if (!response.ok) {
            throw new Error(`Failed to fetch posts on dashboard: ${response.status}`);
        }

        // Destructure the posts from the response JSON
        let { posts, user } = await response.json();
          console.log("dash server",user)
     
     
        // Export data in the consistent format
        return { posts, user };
    } catch (error) {
        console.error('Failed to load posts:', error);

        // Return an empty array in case of an error
     
        return {images: []  };
    }
}
