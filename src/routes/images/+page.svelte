<script>
   import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
   import { imageresize,imagesq } from '$lib/images.js';
   import { searchdata} from './sharedimages.svelte.js';

    let images = $props();
    
    let gridimages = images.data.props.images;
    searchdata.pics = gridimages;
    $inspect(searchdata.pics)
    searchdata.query = "initial query";

  // Perform search on posts
  const performSearch = () => {
        if (searchdata.query.trim() === '') {
            searchdata.pics = gridimages;
        } else {
            searchdata.pics = gridimages.filter(
                post =>
                    post.title.toLowerCase().includes( searchdata.query.toLowerCase())
                 
            );
        }
    };

 
  
    let selectedFile = null;
  
    // Handle file selection
    function onFileSelect(event) {
      selectedFile = event.target.files[0];
    }
  
    // Handle file upload
    async function uploadFile() {
      if (!selectedFile) {
        alert("Please select a file to upload.");
        return;
      }
  
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", selectedFile.name);
      formData.append("alt", "Uploaded image");
  
      try {
        if (!pb.authStore.isValid) {
          alert("You must be logged in to upload files.");
          return;
        }
  
        const newImage = await pb.collection('images').create(formData);
        searchdata.pics = [newImage, ...searchdata.pics]; // Add the new image to the top
        selectedFile = null;
      } catch (error) {
        console.error('Error uploading file:', error);
        alert("Error uploading the file. Please try again.");
      }
    }
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


  
  
  <!-- Upload Section -->
  <div class="upload-section">
    <input type="file" accept="image/*" onchange={onFileSelect} />
    <button onclick={uploadFile}>Upload</button>
  </div>
  <h1>Image Gallery</h1>
  {searchdata.query}
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

  <!-- Display images -->
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
    /* General Styling */
    h1 {
      text-align: center;
      margin: 20px 0;
      font-size: 2.5rem;
      color: #444;
    }
  
    .upload-section {
      text-align: center;
    }
  
    .upload-section input {
      margin-right: 10px;
    }
  
    .upload-section button {
      padding: 10px 15px;
      background-color: #007BFF;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
    .upload-section button:hover {
      background-color: #0056b3;
    }
  
    /* No Images Message */
    .no-images {
      text-align: center;
      font-size: 1.2rem;
      color: #777;
      margin: 20px 0;
    }
  
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