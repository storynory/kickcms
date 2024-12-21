import { json } from '@sveltejs/kit';
import { login as authenticate, userState, pb } from '$lib/pocketbase.svelte.js';

export async function POST({ request }) {
    try {
        const { email, password } = await request.json();

        // Authenticate the user
        await authenticate(email, password);

        if (userState.user) {
              console.log("user state", userState.user)
            return json({ success: true, user: userState.user });
        } else {
            return json({ success: false, message: 'Authentication failed. Please try again.' });
        }
    } catch (error) {
        return json({ success: false, message: error.message || 'Invalid email or password.' });
    }
}
