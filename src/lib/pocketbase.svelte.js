import PocketBase from 'pocketbase';

// Initialize PocketBase
export const pb = new PocketBase('http://127.0.0.1:8090');

// Reactive user state
export const userState = $state({
    user: pb.authStore.isValid ? pb.authStore.model : null, // Initialise based on PocketBase's auth state
});

// Login function: Authenticates the user and updates the state
export async function login(email, password) {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        userState.user = authData.record; // Update user state after successful login
    } catch (err) {
        console.error('Login failed:', err);
        throw err; // Propagate error to the caller
    }
}

// Logout function: Clears the authentication store and resets the user state
export function logout() {
    pb.authStore.clear(); // Clear PocketBase's auth store
    userState.user = null; // Reset the user state
}


export function requireAuth(userState) {
    if (!userState.user) {
        throw new Error('User not authenticated');
    }
}
