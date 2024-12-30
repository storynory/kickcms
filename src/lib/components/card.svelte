<script>
    import { formatFriendlyDate } from "$lib/utils/dateFormater.js";
    import { pb,pblocation,imageresize  } from '$lib/pocketbase.svelte.js'; 
    // Props passed to the component
    let { 
        title = '', 
        created = '', 
        featuredImage = [], 
        alt = '', 
        excerpt = '', 
        id = '' 
    } = $props();
</script>

<div class="post-card">
    <div class="post-thumbnail">
        {#if featuredImage.collectionId}
        <a href="/posts/{id}">
        <img 
        src={`${imageresize}/sq/300/${featuredImage.id}/${featuredImage.image}`} 
        alt={featuredImage.alt || alt || title || 'Image'} 
        width=300
        height=300

      />
    </a>
        {:else}
       
            <div class="placeholder-icon">
                <a href="/posts/{id}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ccc" width="300" height="300">
                    <path d="M3 4v16h18V4H3zm16 14H5V6h14v12zm-4-6H7v-2h8v2zm2 4H7v-2h10v2z" />
                    alt={featuredImage.alt || alt || title || 'Image'} 
                </svg>
            </a>
            </div>
        {/if}
    </div>
    <div class="post-content">
        <h3>{title}</h3>
        <p class="post-excerpt">{excerpt || 'No excerpt available.'}</p>
        <p><small>{formatFriendlyDate(created)}</small></p>
        <div class="post-actions">
            <a href="/posts/{id}" class="edit-button">Edit</a>
        </div>
    </div>
</div>

<style>
    .edit-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #007BFF; /* Bright blue background */
  color: #ffffff; /* White text */
  text-decoration: none; /* Remove underline */
  border-radius: 0.25rem; /* Rounded corners */
  font-family: Arial, sans-serif; /* Clean, modern font */
  font-size: 1rem; /* Readable text size */
  font-weight: bold; /* Slightly bold for emphasis */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth hover effect */
}

.edit-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
  transform: scale(1.05); /* Slight zoom effect */
  text-decoration: none; /* Ensure no underline appears */
}

.edit-button:active {
  background-color: #004085; /* Even darker blue on click */
  transform: scale(1); /* Reset zoom on click */
}

.edit-button:focus {
  outline: 2px solid #80bdff; /* Accessible focus outline */
  outline-offset: 2px;
}


</style>
