<script>
    let images = $props();
    let pics = images.data.props.images;
  </script>
  
  <h1>Image Gallery</h1>
  
  <!-- Display a fallback message if no images are available -->
  {#if pics.length > 0}
    <div class="gallery">
      {#each pics as image}
        <div class="gallery-item">
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
  
    p {
      margin: 0;
      padding: 0;
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
  
    /* Responsive Design */
    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }
  
      .gallery {
        gap: 15px;
      }
  
      .image-info h3 {
        font-size: 1rem;
      }
  
      .image-info p {
        font-size: 0.8rem;
      }
    }
  
    @media (max-width: 480px) {
      h1 {
        font-size: 1.5rem;
      }
  
      .gallery {
        gap: 10px;
      }
  
      .image-info h3 {
        font-size: 0.9rem;
      }
  
      .image-info p {
        font-size: 0.75rem;
      }
    }
  </style>
  