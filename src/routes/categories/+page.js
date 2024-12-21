// src/routes/categories/+page.js
import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
  
export async function load() {
    try {
        const response = await pb.collection('categories').getList(1, 50); // Fetch first 50 posts
        let categories = response.items;
        console.log("// src/routes/categories/+page.js" ,response.items)
     
    } catch (err) {
        console.error('Error fetching posts:', err);
    } 
}
