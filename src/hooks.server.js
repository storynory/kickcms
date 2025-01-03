import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';




/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

    // load the store data from the request cookie string
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
    } catch (_) {
        // clear the auth store on failed refresh
        event.locals.pb.authStore.clear();
    }

    const response = await resolve(event);
    const authCookie = event.locals.pb.authStore.exportToCookie({
        secure: false, // Set to `true` for HTTPS in production
        httpOnly: false,
        sameSite: 'Lax',
        path: '/',
        todo: "write lapis"
    });
    
    
        // Append the cookie to the response
        response.headers.append('set-cookie', authCookie);
    
    return response;
}