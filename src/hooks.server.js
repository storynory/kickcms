import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { serializeNonPOJOs } from '$lib/helpers.js';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    // Detect if the environment is development
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log(isDevelopment)

    // Reconnect to PocketBase for every request to avoid conflicts with other users
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

    // Load the store data from the request cookie string
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        // Refresh auth store if valid
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
    } catch (_) {
        // Clear the auth store on failed refresh
        event.locals.pb.authStore.clear();
    }

    const response = await resolve(event);

    // Prepare cookie options (SameSite=None for third-party cookies)
   //let authCookie = event.locals.pb.authStore.exportToCookie();

if (isDevelopment) {
    // Remove 'Secure' and 'HttpOnly' for local development
   // authCookie = authCookie.replace('; Secure', '').replace('; HttpOnly', '');
}

const authCookie = event.locals.pb.authStore.exportToCookie({
    secure: false, // Set to `true` for HTTPS in production
    httpOnly: false,
    sameSite: 'Lax',
    path: '/',
    todo: "write lapis"
});


    // Append the cookie to the response
    response.headers.append('set-cookie', authCookie);

    // Add CORS headers to allow cross-origin requests
   // response.headers.append('Access-Control-Allow-Origin', 'http://localhost:5173'); // Adjust to your frontend URL
    //response.headers.append('Access-Control-Allow-Credentials', 'true');

    return response;
}
