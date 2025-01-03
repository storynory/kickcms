<script>
    import { logout,  } from '$lib/pocketbase.svelte.js';
    //import { userState} from '$lib/shared.svelte.js'; // Import PocketBase instance and user state
   

    import { goto } from '$app/navigation';
    import UserIcon from "$lib/components/icons/user.svelte"
    import HomeIcon from "$lib/components/icons/home.svelte"
     import ImageIcon from "$lib/components/icons/iconImage.svelte"
    import SocketIcon from "$lib/components/icons/socket.svelte"
    // Reactive state variables using runes API
    let showDropdown = $state(false); // Dropdown visibility state

    // Reactive derived value for username

let username =  "bertie"

    // Logout function
    const handleLogout = () => {
        logout(); // Clear user session
        showDropdown = false; // Hide dropdown
        goto('/login'); // Redirect to login page
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        showDropdown = !showDropdown;
    };
</script>

<nav class = "content">
   
    <div class="nav-left">
        <a class="-p-x" href="/socket/dashboard" aria-label="Go to Dashboard">
        <HomeIcon />
        </a>
        <a class="-p-x" href="/socket/images" aria-label="Go to images">
            <ImageIcon />
            </a>
      </div>
     
    


    <div class="nav-right">
        <div class="-p-x"><a href="/posts/new">+ Create</a></div>
        <button
            class="user-icon"
            onclick={toggleDropdown}
            aria-expanded={showDropdown}
            aria-label="User menu"
        >  <UserIcon />
        </button>
        <span class="username">{username}</span>
        {#if showDropdown}
            <div class="dropdown" role="menu">
               
                    <button onclick={handleLogout} role="menuitem">Logout</button>
              
                    <a href="/" role="menuitem">Login</a>
           
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
       flex-wrap: wrap;
   
    }

  a {
    color: white;
    text-decoration: none;
  }
    .nav-left {
        font-size: 1.2rem;
        display: flex;
        align-items: flex-start;
        justify-items: center;
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