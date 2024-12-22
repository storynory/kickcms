<script>
    import { goto } from '$app/navigation';
    import { login as authenticate, userState } from '$lib/pocketbase.svelte.js';
   
   
    // Define reactive variables using runes
    let email = $state('');
    let password = $state('');
    let error = $state('');

    // Log in the user
    const handleLogin = async () => {
        try {
            await authenticate(email, password); // Use the imported login function
            if (userState.user) {
                error = ''; // Clear error if login succeeds
                goto('/dashboard'); // Redirect to dashboard
            } else {
                error = 'Authentication failed. Please try again.';
            }
        } catch (err) {
            console.error('Login failed:', err);
            error = err?.message || 'Invalid email or password. Please try again.';
        }
    };
</script>

<h1>Login</h1>

<!-- Display error message -->
{#if error}
    <p style="color: red; margin-bottom: 1rem;">{error}</p>
{/if}

<!-- Login Form -->
<form onsubmit={() => { event.preventDefault(); handleLogin(); }} style="max-width: 400px; margin: 0 auto;">
    <div style="margin-bottom: 1rem;">
        <label for="email" style="display: block; margin-bottom: 0.5rem;">Email:</label>
        <input
            id="email"
            type="email"
            bind:value={email}
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px;"
        />
    </div>

    <div style="margin-bottom: 1rem;">
        <label for="password" style="display: block; margin-bottom: 0.5rem;">Password:</label>
        <input
            id="password"
            type="password"
            bind:value={password}
            required
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px;"
        />
    </div>

    <button
        type="submit"
        style="
            background-color: #007bff;
            color: #fff;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        "
    >
        Login
    </button>
</form>

