<script>
    import { userState, logout } from '$lib/pocketbase.svelte.js';
    import { goto } from '$app/navigation';

    // Reactive state variables using runes API
    let showDropdown = $state(false); // Dropdown visibility state

    // Reactive derived value for username
   
let username =   $derived (userState.user?.name || userState.user?.email || 'Not Logged In')


    // Logout function
    const handleLogout = () => {
        logout(); // Clear user session
        showDropdown = false; // Hide dropdown
        goto('/'); // Redirect to login page
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        showDropdown = !showDropdown;
    };
</script>

<nav class = "content">
    {#if userState.user}
    <div class="nav-left">
        <a href="/dashboard" aria-label="Go to Dashboard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true" 
          >
            <rect x="7" y="9" width="10" height="9" rx="2" ry="2"></rect>
            <path d="M9 9V4"></path>
            <path d="M15 9V4"></path>
            <path d="M7 22h10"></path>
          </svg>
        </a>
      </div>
    

    {/if}
    <div class="nav-right">
        <div class="-p-x"><a href="/posts/new">+ Create</a></div>
        <button
            class="user-icon"
            onclick={toggleDropdown}
            aria-expanded={showDropdown}
            aria-label="User menu"
        >  
        </button>
        <span class="username">{username}</span>
        {#if showDropdown}
            <div class="dropdown" role="menu">
                {#if userState.user}
                    <button onclick={handleLogout} role="menuitem">Logout</button>
                {:else}
                    <a href="/" role="menuitem">Login</a>
                {/if}
            </div>
        {/if}
    </div>
</nav>

<style>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #333;
        color: white;
        padding: 10px 50px ;
        position: fixed;
       width: 100%;
       z-index: 99;
   
    }

  a {
    color: white;
    text-decoration: none;
  }
    .nav-left {
        font-size: 1.2rem;
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative; /* For dropdown positioning */
    }

    .user-icon {
        width: 32px;
        height: 32px;
        background-color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333;
        font-size: 1.2rem;
        cursor: pointer;
        position: relative;
        border: none;
    }

    .user-icon:hover {
        background-color: #ddd;
    }

    .username {
        font-size: 1rem;
        color: white;
    }

    .dropdown {
        position: absolute;
        top: 100%; /* Position below the user icon */
        right: 0;
        background-color: #444;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 8px;
        z-index: 10;
    }

    .dropdown button,
    .dropdown a {
        display: block;
        width: 100%;
        padding: 8px 16px;
        background: none;
        border: none;
        text-align: left;
        font-size: 1rem;
        color: white;
        cursor: pointer;
        text-decoration: none;
    }

    .dropdown button:hover,
    .dropdown a:hover {
        background-color: #555;
    }
</style>
