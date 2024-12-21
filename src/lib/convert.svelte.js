import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// A Svelte store to track the user state
export const user = writable(pb.authStore.model); // Initially set to current user or `null`

// Make PocketBase instance accessible if needed
export { pb };

// Reactive assignment: Updates `user` store whenever `pb.authStore.model` changes
$: user.set(pb.authStore.model);

// Functions for login and logout
export async function login(email, password) {
    try {
        await pb.collection('users').authWithPassword(email, password);
    } catch (err) {
        console.error('Login failed:', err);
        throw err;
    }
}

export function logout() {
    pb.authStore.clear(); // Clear the authentication store
}