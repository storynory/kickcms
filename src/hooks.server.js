import PocketBase from 'pocketbase';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const pb = new PocketBase('https://content.socketcms.com');
    event.locals.pb = pb;

    // Load the auth store from cookies
    const authCookie = event.request.headers.get('cookie') || '';
    console.log('[Auth] Incoming cookie:', authCookie ? 'Present' : 'Not present');

    pb.authStore.loadFromCookie(authCookie);

    try {
        if (pb.authStore.isValid) {
            console.log('[Auth] Valid session found. Attempting to refresh...');
            await pb.collection('users').authRefresh();
            console.log('[Auth] Session successfully refreshed.');
        } else {
            console.warn('[Auth] No valid session. Clearing auth store.');
            pb.authStore.clear();
        }
    } catch (err) {
        console.error('[Auth] Failed to refresh session:', err.message);
        pb.authStore.clear();
    }

    // Proceed with resolving the request
    const response = await resolve(event);

    // Export updated auth store to cookies
    const exportedCookie = pb.authStore.exportToCookie({
        secure: false, // Use true for HTTPS
        httpOnly: true,
        sameSite: 'Lax',
        path: '/',
    });

    response.headers.append('set-cookie', exportedCookie);
    console.log('[Auth] Set-cookie header updated');

    return response;
}
