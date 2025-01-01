<script>
    import { pb, userState,imageresize  } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
    import Card from "$lib/components/card.svelte";
    import { onMount } from 'svelte';
   // let posts = $state([]); // List of posts
    let data = $props();// Full list of posts to filter from
    //$inspect("posts:", posts.data.posts)
    let  posts = $state()
    posts = data.data.posts.posts

    let error = ''; // Error message
    let query = $state(''); // Search query

    // Fetch all recent posts on page load
    const fetchPosts = async () => {
        try {
            const response = await pb.collection('posts').getList(1, 50, {
                sort: '-created', // Fetch recent posts
                expand: 'featuredImage', // Include full details of the featured image

            });
            allPosts = response.items; // Store all posts
            posts = allPosts; // Display all posts initially
        } catch (err) {
            console.error('Error fetching posts:', err);
            error = 'Failed to fetch posts. Please try again.';
        }
    };

    // Perform search on posts
    const performSearch = () => {
        if (query.trim() === '') {
            posts = allPosts; // Reset to all posts if query is empty
        } else {
            posts = allPosts.filter(
                post =>
                    post.title.toLowerCase().includes(query.toLowerCase()) ||
                    post.excerpt.toLowerCase().includes(query.toLowerCase())
            );
        }
    };

    // Debounced search function
    function debounce(func, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const debouncedSearch = debounce(performSearch, 100);


</script>
<!-- Welcome Message -->
{#if userState.user}
  <p>Welcome, {userState.user.name || userState.user.email}!</p>
{:else}
  <p>You need to be logged in to view posts.</p>
{/if}
<h1>Your Website Admin</h1>
<div class="svg-container">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
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
  <p>Socket CMS</p>
</div>
<div class="search-container">
    <input
        bind:value={query}
        class="search-input"
        type="text"
        name="q"
        placeholder="Search Posts"
        aria-label="Search"
        oninput={debouncedSearch} 
    />
  
</div>



{#if userState.user}
  <!-- Posts List -->

  {#if posts.length > 0}
    <div class="posts-grid">
      {#each posts as post}
        <Card 
          title={post.title}
          created={post.created}
          featuredImage={post.expand?.featuredImage} 
          alt={post.title}
          excerpt={post.excerpt}
          id={post.id}
        />
      {/each}
    </div>
  {:else}
    <p>No posts found.</p>
  {/if}
{/if}

<style>


.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
}


/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 0 auto;
  max-width: 1200px;
}

/* Responsive Design */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }


}

/* Page Styling */

/* Center the search container */
.search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;
    max-width: 700px;
    width: 100%;
}

/* Modern Search Input */
.search-input {
    flex: 1;
    padding: 1rem;
    font-size: 1.25rem;
    border: 2px solid #ddd;
    border-radius: 50px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    outline: none;
    transition: all 0.3s ease-in-out;
    max-width: 500px;
}

/* Focus Effect */
.search-input:focus {
    border-color: #0078ff;
    box-shadow: 0 0 10px rgba(0, 120, 255, 0.5);
}

/* Placeholder Text */
.search-input::placeholder {
    color: #aaa;
    font-style: italic;
}



/* Responsive Design */
@media (max-width: 768px) {
    .search-container {
        flex-direction: column;
        gap: 1rem;
    }

    .search-input
  {
        width: 100%;
    }

   
}
</style>