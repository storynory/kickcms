<script>
    import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
   import { imageresize,imagesq } from '$lib/images.js';
   import { searchdata} from './sharedImages.svelte.js';
   import Pagination from "./ImagePaginate.svelte";
   import { onMount } from 'svelte';
   import Fuse from 'fuse.js';

 let fuse; // Declare Fuse instance
  let allpics = []; // Store all images
  searchdata.showPagination = true
  // Initialize Fuse.js on mount
  onMount(async () => {
    try {
      // Fetch all posts from the "images" collection
      let allposts = await pb.collection('images').getFullList({
        sort: '-created',
      });

      // Extract relevant fields for Fuse.js
      allpics = allposts.map(post => ({
        title: post.title,
        alt: post.alt,
        image: post.image,
        id: post.id,
      }));

      // Initialize Fuse.js with options
      fuse = new Fuse(allpics, {
        keys: ['title', 'alt'], // Search on title and alt fields
        threshold: 0.3,         // Adjust fuzziness level (lower is stricter)
      });
    } catch (error) {
      console.error("Error initializing Fuse.js:", error);
    }
  });

  const performSearch = () => {
    searchdata.showPagination = true;
    try {
      if (!fuse) {
        console.error("Fuse.js is not initialized");
        return; // Exit the function if Fuse is not ready
      }

      if (searchdata.query.trim() === '') {
        // Reset to grid images when the search query is empty
        if (!Array.isArray(searchdata.gridimages)) {
          
          console.error("Error: gridimages is not defined or is not an array");
          searchdata.pics = []; // Fallback to an empty array
        } else {
          searchdata.pics = searchdata.gridimages;
          searchdata.showPagination = true;
        }
      } else {
        // Perform the search and map results
        searchdata.showPagination = false
        const searchResults = fuse
          .search(searchdata.query)
          .map(result => result.item);

        if (searchResults.length === 0) {
          console.warn("No matches found for the search query");
          searchdata.pics = searchdata.gridimages; // Set to grid images for no matches
        } else {
          searchdata.pics = searchResults;
        }
      }
    } catch (error) {
      console.error("Error performing search:", error);
      searchdata.pics = []; // Fallback to an empty array on error
    }
  };
// Call the function
performSearch();

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

<div class="page-width search-container -p-lg">
  <input
  bind:value={searchdata.query}
class="search-input"
  type="text"
  name="q"
  placeholder="Search images"
  aria-label="Search"
  oninput={debouncedSearch } 
/>
</div>
{#if searchdata.pics.length > 0}

<div class="gallery">
    {#each searchdata.pics as image}
      <div class="gallery-item">
        <a href={`/images/${image.id}`}>
          <div class="image-container">
            <img 
              src="{imagesq}/300/{image.id}/{image.image}"
              alt={image.alt || image.title || 'Image'} 
              loading="lazy" 
            />
          </div>
          <div class="image-info">
            <h3>{image.title || 'Untitled'}</h3>
            <p>{image.alt || 'No description available'}</p>
          </div>
        </a>
      </div>
    {/each}
  </div>
{:else}
  <p class="no-images">No images available to display.</p>
{/if}
<style>
 /* Gallery Styling */
 .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .gallery-item {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
      max-width: 300px;
    }
  
    .gallery-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
  
    .image-container {
      position: relative;
      overflow: hidden;
      aspect-ratio: 1; /* Ensures images are square */
  
    }
  
    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  
    .image-info {
      padding: 15px;
      text-align: center;
    }
  
    .image-info h3 {
      margin: 10px 0 5px;
      font-size: 1.2rem;
      color: #333;
    }
  
    .image-info p {
      font-size: 0.9rem;
      color: #666;
    }


    /* Modern Search Input */
.search-container {
    display: flex;
    align-items: center;
    justify-content: center; /* Optional: Aligns items horizontally */
}

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


</style>