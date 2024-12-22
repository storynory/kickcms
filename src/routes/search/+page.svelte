<script>
    import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
    import Card from "$lib/components/card.svelte";

    let posts = $state([]); // List of posts
    let allPosts = $state([]); // Full list of posts to filter from
    let error = ''; // Error message
    let query = $state(''); // Search query

    // Fetch all recent posts on page load
    const fetchPosts = async () => {
        try {
            const response = await pb.collection('posts').getList(1, 50, {
                sort: '-created', // Fetch recent posts
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

    // Fetch posts on component initialisation
    fetchPosts();
</script>
<!-- Welcome Message -->

<h1>Posts</h1>
<div class="search-container">
    <input
        bind:value={query}
        class="search-input"
        type="text"
        name="q"
        placeholder="Search by title or excerpt"
        aria-label="Search"
        oninput={debouncedSearch} 
    />
    <button class="search-button" onclick={debouncedSearch}>Search</button>
</div>



{#if userState.user}
  <!-- Posts List -->

  {#if posts.length > 0}
    <div class="posts-grid">
      {#each posts as post}
        <Card 
          title={post.title}
          created={post.created}
          featuredImage={post.featuredImage}
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
h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4a4a4a;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #444;
}

p {
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1.5rem;
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

  h2 {
    font-size: 1.5rem;
  }
}

/* Page Styling */
h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #4a4a4a;
}

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

/* Search Button */
.search-button {
    padding: 1rem 2rem;
    font-size: 1.25rem;
    margin-left: 1rem;
    background-color: #0078ff;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
}

/* Button Hover Effect */
.search-button:hover {
    background-color: #005fcc;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
    .search-container {
        flex-direction: column;
        gap: 1rem;
    }

    .search-input,
    .search-button {
        width: 100%;
    }

    .search-button {
        margin-left: 0;
    }
}
</style>


