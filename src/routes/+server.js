import PocketBase from 'pocketbase';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request, locals }) {
    const pb = locals.pb;

    try {
        const { email, password } = await request.json();

        // Authenticate with PocketBase
        const authData = await pb.collection('users').authWithPassword(email, password);

        // Export auth store to a cookie
        const authCookie = pb.authStore.exportToCookie({
            secure: false, // Set to `true` for HTTPS in production
            httpOnly: true,
            sameSite: 'Lax',
            path: '/',
        });

        return new Response(JSON.stringify(authData), {
            status: 200,
            headers: {
                'set-cookie': authCookie,
            },
        });
    } catch (err) {
        console.error('Login failed:', err);
        return new Response(JSON.stringify({ message: err.message }), { status: 401 });
    }
}
