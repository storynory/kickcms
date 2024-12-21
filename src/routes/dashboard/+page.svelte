<script>
    import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
    import { goto } from '$app/navigation';

    let posts = []; // List of posts
    let error = ''; // Error message

    // Fetch posts (public content)
    const fetchPosts = async () => {
        try {
           
            const response = await pb.collection('posts').getList(1, 50); // Fetch first 50 posts
            posts = response.items;
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };
   fetchPosts();
</script>

<h1>Dashboard</h1>

<!-- Welcome Message -->
{#if userState.user}
    <p>Welcome, {userState.user.name || userState.user.email}!</p>
{:else}
    <p>Need to be logged in to fetch posts </p>
{/if}

{#if userState.user}
<!-- Posts List -->
<h2>Posts</h2>
{#if posts.length > 0}
    <ul>
        {#each posts as post}
            <li>
                <a href="/posts/{post.id}">
                    <strong>{post.title} - {post.slug}</strong>
                </a>
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
