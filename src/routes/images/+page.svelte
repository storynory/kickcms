<script>
  import { pb } from '$lib/pocketbase.svelte.js';

  let images = $props();
  let pics = $state(images.data.props.images);

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
      pics = [newImage, ...pics]; // Add the new image to the top
      selectedFile = null;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Error uploading the file. Please try again.");
    }
  }
</script>

<h1>Image Gallery</h1>

<!-- Upload Section -->
<div class="upload-section">
  <input type="file" accept="image/*" onchange={onFileSelect} />
  <button onclick={uploadFile}>Upload</button>
</div>

<!-- Display images -->
{#if pics.length > 0}
  <div class="gallery">
    {#each pics as image}
      <div class="gallery-item">
        <a href={`/images/${image.id}`}>
          <div class="image-container">
            <img 
              src={`http://127.0.0.1:8090/api/files/${image.collectionId}/${image.id}/${image.image}?thumb=300x300`} 
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
    margin-bottom: 20px;
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
</style>
