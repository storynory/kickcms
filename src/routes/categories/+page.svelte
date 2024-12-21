<script>
    // src/routes/categories/+page.svelte
    import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
    import { goto } from '$app/navigation';

    let categories = $state([]); // List of posts
    let error = ''; // Error message

    // Fetch posts (public content)
    const fetchPosts = async () => {
        try {
           
            const response = await pb.collection('categories').getList(1, 50); // Fetch first 50 posts
            categories = response.items;
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };
    fetchPosts();
</script>

<h1>categories</h1>

<!-- Welcome Message -->
{#if userState.user}
  <a href="/categories/edit/new">Add new Category</a>
{:else}
    <p>Need to be logged in to fetch posts </p>
{/if}

{#if userState.user}
<!-- Posts List -->
<h2>categories</h2>
{#if categories.length > 0}
    <ul>
        {#each categories as cat}
            <li>
                <a href="/categories/edit/{cat.id}">
                    <strong>{cat.title}</strong>   
                </a>
                {@html cat.description}
            </li>
        {/each}
    </ul>
{:else}
    <p>No posts found.</p>
{/if}
{/if}
<style>
    /* Your existing styles remain unchanged */
</style>
