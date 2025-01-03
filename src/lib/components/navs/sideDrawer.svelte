<script>
      import { userState, logout } from '$lib/pocketbase.svelte.js';
    let isOpen = $state(false);

    const toggleDrawer = () => {
        isOpen = !isOpen;
    };
</script>

<button
  type="button"
  class="drawer-backdrop"
  class:visible={isOpen}
  onclick={toggleDrawer}
  aria-label="Close Drawer"
></button>

<div class="drawer" class:open={isOpen}>
    <button class="close-btn" onclick={toggleDrawer} aria-label="Close Drawer">✕</button>
    <nav>
        <ul>
       <li><a href="/socket/dashboard">Dashboard</a></li>
        <li><a href="/socket/posts/new">New Post</a></li>
        <li><a href="/socket/images">Images</a></li>
        <li><a href="/socket/categories">Categories</a></li>
        <li><a href="/socket/categories/edit/new">Add Category</a></li>
    </ul>
    </nav>
</div>

<button class="menu-btn" onclick={toggleDrawer} aria-label="Open Drawer">☰</button>

<style>
    .drawer {
        position: fixed;
        top: 0;
        left: -100%; /* Hidden by default */
        width: 250px;
        height: 100%;
        background-color: #333;
        color: white;
        display: flex;
        flex-direction: column;
        padding: 20px;
        transition: left 0.3s ease-in-out;
        z-index: 100;
    
    }
    .drawer.open {
        left: 0; /* Slide in */
    }
    .drawer a {
        text-decoration: none;
        color: white;
        padding: 10px 0;
        font-size: 1.2rem;
    }
    .drawer a:hover {
        background-color: #555;
    }
    .menu-btn {
        position: fixed;
        top: 3px;
        left: 10px;
        background: none;
        border: none;
        color: white;
        font-size: 32px;
        cursor: pointer;
        z-index: 110;
        vertical-align: center;

    }
    .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        align-self: flex-end;
        cursor: pointer;
        margin-bottom: 20px;
    }
    .drawer-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 99;
    }
    .drawer-backdrop.visible {
        display: block;
    }
    
    nav {
    width: 200px; /* Adjust width as needed */

    border-radius: 8px; /* Slightly rounded corners */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    padding: 1rem; /* Add padding inside the nav */
}

nav ul {
    list-style: none; /* Remove bullet points */
    padding: 0; /* Remove default padding */
    margin: 0; /* Remove default margin */
    display: flex;
    flex-direction: column;
    gap: 1rem; /* Spacing between menu items */
}

nav li {
    text-align: left; /* Align text to the left */
}

nav a {
    text-decoration: none; /* Remove underline from links */
    font-size: 1rem; /* Modern readable font size */

   
    padding: 0.8rem 1rem; /* Comfortable click area */
    border-radius: 6px; /* Rounded corners */
    display: block; /* Full width clickable */
    transition: all 0.3s ease; /* Smooth transitions for hover effects */
}

nav a:hover {
    background-color: #007bff; /* Bright blue hover */
    color: #ffffff; /* White text on hover */
    box-shadow: 0 4px 6px rgba(0, 123, 255, 0.3); /* Slight shadow for hover */
    transform: translateY(-2px); /* Subtle lift effect */
}

nav a:active {
    background-color: #0056b3; /* Slightly darker on click */
    transform: translateY(1px); /* Button depress effect */
}

</style>
