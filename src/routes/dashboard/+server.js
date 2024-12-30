import { json } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase.svelte.js';
export async function GET() {
    try {
        const response = await pb.collection('posts').getList(1, 50, {
            sort: '-created',
            expand: 'featuredImage',
        });
        return json(response.items);
    } catch (err) {
        console.error('Error fetching posts:', err);
        return new Response('Failed to fetch posts', { status: 500 });
    }
}
