// src/hooks.server.js
import PocketBase from 'pocketbase';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    event.locals.pb = new PocketBase('https://content.socketcms.com');

    // Load auth store from cookies
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        // Refresh auth if valid
        if (event.locals.pb.authStore.isValid) {
            await event.locals.pb.collection('users').authRefresh();
        }
    } catch (err) {
        // Clear auth on error
        event.locals.pb.authStore.clear();
    }

    const response = await resolve(event);

    // Export auth store to cookies
    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

    return response;
}
