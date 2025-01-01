<script>
    import { goto } from '$app/navigation';
    import { imageresize,imagesq, } from '$lib/images.js'; 
    import {imageData} from "../sharedImages.svelte.js"
    import {saveImage, confirmDeleteImage} from "../imageHelpers.js"
    let props = $props();
    const image = props.data
  

// set initial information from props

      imageData.title = image.title
      imageData.alt = image.alt
      imageData.error = '',
      imageData.success = '',
      imageData.showModal = false;
     
  // Derived imageData for `data` to use in save function
 
  let data = $derived(
    {
        title: imageData.title,
        alt: imageData.alt
    }
 );
   

  // the delete modal to confrim delte
    const openModal = () => (imageData.showModal = true);
    const closeModal = () => (imageData.showModal = false);
  
  // save from keyboard
    function handleKeydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveImage(image.id, data);
      }
    }
  </script>
  
  <svelte:window onkeydown={handleKeydown} />
  
  <h1>{image.id? 'Image Details' : 'Image Not Found'}</h1>
  
  <!-- Success/Error Messages -->
  {#if imageData.success}
    <p style="color: green;">{imageData.success}</p>
  {/if}
  {#if imageData.error}
    <p style="color: red;">{imageData.error}</p>
  {/if}
  
  {#if image.id}
  <figure>
    <header>
        <h2>600 Width</h2>
      </header>
    <img src="{imageresize}/600/{image.id}/{image.file}" alt="{imageData.alt}" width=600  /> 
    <figcaption>{imageData.title}</figcaption>
  </figure>

 
  <figure>
    <header>
     <h2>300 Square</h2>
    </header>
    <img src="{imagesq}/300/{image.id}/{image.file}" alt="{imageData.alt}" width=300 />
    <figcaption>{imageData.title}</figcaption>
  </figure>
  
    <!-- Form -->
    <form onsubmit={(e) => { e.preventDefault();   saveImage(image.id, data); }}>
      <label for="title">Title:</label>
      <input id="title" type="text" bind:value={imageData.title} placeholder="Image Title" required />
  
      <label for="alt">Alt Text:</label>
      <input id="alt" type="text" bind:value={imageData.alt} placeholder="Alt Text" />
  
      {#if imageData.success}
      <p style="color: green;">{imageData.success}</p>
    {/if}
    {#if imageData.error}
      <p style="color: red;">{imageData.error}</p>
    {/if}
    


      <button type="submit">Save Changes</button>
      <button type="button" onclick={() => goto('/images')}>Back to Gallery</button>
      <button type="button" onclick={openModal} style="background-color: #d9534f; color: white;">Delete Image</button>
    </form>
  {/if}
  
  <!-- Confirmation Modal -->
  {#if imageData.showModal}
    <div class="modal-backdrop">
      <div class="modal">
        <p>Are you sure you want to delete this image? This action cannot be undone.</p>
        <button onclick={confirmDeleteImage(image.id)} style="background-color: #d9534f; color: white;">Yes, Delete</button>
        <button onclick={closeModal} style="background-color: #f4f4f4; color: #555;">Cancel</button>
      </div>
    </div>
  {/if}
  
  <style>

figure {
    max-width: 800px;
    margin: auto;
    display: block; /* Use inline-block to keep the figure centered without flexbox */
    text-align: center; /* Ensures text inside figcaption is centered */
}

figure img {
    display: block; /* Prevents inline spacing issues with images */
    margin: 0 auto; /* Centers the image */
}

figcaption {
    margin-top: 8px; /* Adds spacing between image and caption */
    font-size: 0.9rem; /* Optional: Adjust the font size for the caption */
    color: #555; /* Optional: Style the caption text */
}

    
    
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    
    .modal {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      text-align: center;
      width: 90%;
      max-width: 400px;
    }
    
    .modal p {
      margin-bottom: 1.5rem;
      font-size: 1.2rem;
      color: #444;
    }
    
    .modal button {
      margin: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
    }
    
    .modal button:first-child {
      background-color: #d9534f;
      color: white;
      border: none;
    }
    
    .modal button:last-child {
      background-color: #f4f4f4;
      color: #555;
      border: 1px solid #ddd;
    }
    
    
      form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        max-width: 800px;
        margin: 2rem auto;
        background: #ffffff;
        padding: 3rem;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        border: 1px solid #eaeaea;
      }
    
      label {
        font-size: 1.1rem;
        font-weight: 600;
        color: #444;
        letter-spacing: 0.5px;
      }
    
      input {
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 1.1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background: #fafafa;
        transition: border-color 0.3s;
        font-family: inherit;
      }
    
      input:focus {
        border-color: #8a4fff;
        outline: none;
        box-shadow: 0 0 5px rgba(138, 79, 255, 0.2);
      }
    
     
    
      button {
        padding: 0.75rem 2rem;
        font-size: 1.1rem;
        font-weight: 500;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        letter-spacing: 0.5px;
      }
    
      button[type="submit"] {
        background-color: #8a4fff;
        color: #fff;
        border: none;
      }
    
      button[type="submit"]:hover {
        background-color: #6d3fcc;
      }
    
      button[type="button"] {
        background: #f4f4f4;
        color: #555;
        border: 1px solid #ddd;
      }
    
      button[type="button"]:hover {
        background: #e6e6e6;
      }
    
      p {
        font-size: 1rem;
        text-align: center;
        margin: 0.5rem 0;
      }
    
      p[style="color: green;"] {
        color: #2f8d46;
        font-weight: 600;
      }
    
      p[style="color: red;"] {
        color: #d9534f;
        font-weight: 600;
      }
    
      /* Responsive Design */
      @media (max-width: 768px) {
       
    
        form {
          padding: 2rem;
        }
    
        input, button {
          font-size: 1rem;
        }
      }
    </style>