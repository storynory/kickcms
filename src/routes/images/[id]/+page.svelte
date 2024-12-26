<script>

    import { page } from '$app/stores'; // Access route parameters
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte'; // Import onMount correctly
    import { pb,pblocation, userState } from '$lib/pocketbase.svelte.js'; 
  
    const state = $state({
      imageId: null,
      title: '',
      alt: '',
      error: '',
      success: '',
      showModal: false, // Track modal visibility
      imageUrl: ''
    });
  
    const params = $page.params; // Get route parameters dynamically
  
    // Fetch image details on mount
    onMount(async () => {
      try {
        const image = await pb.collection('images').getOne(params.id);
        state.imageId = image.id;
        state.title = image.title;
        state.alt = image.alt;
        state.imageUrl = `${pblocation}/${image.collectionId}/${image.id}/${image.image}`;
      } catch (err) {
        console.error('Failed to fetch image:', err);
        state.error = 'Image not found.';
      }
    });
  
    const saveImage = async () => {
      state.error = '';
      state.success = '';
  
      const data = {
        title: state.title,
        alt: state.alt
      };
  
      try {
        if (state.imageId) {
          await pb.collection('images').update(state.imageId, data);
          state.success = 'Image updated successfully!';
        }
      } catch (err) {
        console.error('Failed to save image:', err);
        state.error = 'Failed to save image.';
      }
    };
  
    const openModal = () => (state.showModal = true);
    const closeModal = () => (state.showModal = false);
  
    const confirmDeleteImage = async () => {
      closeModal();
      state.error = '';
      state.success = '';
  
      try {
        await pb.collection('images').delete(state.imageId);
        state.success = 'Image deleted successfully!';
        goto('/images');
      } catch (err) {
        console.error('Failed to delete image:', err);
        state.error = 'Failed to delete image.';
      }
    };
  
    function handleKeydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveImage();
      }
    }
  </script>
  
  <svelte:window onkeydown={handleKeydown} />
  
  <h1>{state.imageId ? 'Edit Image' : 'Image Not Found'}</h1>
  
  <!-- Success/Error Messages -->
  {#if state.success}
    <p style="color: green;">{state.success}</p>
  {/if}
  {#if state.error}
    <p style="color: red;">{state.error}</p>
  {/if}
  
  {#if state.imageId}
    <img src={state.imageUrl} alt={state.alt || 'Image'} style="max-width: 100%; height: auto; margin-bottom: 20px;" />
  
    <!-- Form -->
    <form onsubmit={(e) => { e.preventDefault(); saveImage(); }}>
      <label for="title">Title:</label>
      <input id="title" type="text" bind:value={state.title} placeholder="Image Title" required />
  
      <label for="alt">Alt Text:</label>
      <input id="alt" type="text" bind:value={state.alt} placeholder="Alt Text" />
  
      <button type="submit">Save Changes</button>
      <button type="button" onclick={() => goto('/images')}>Back to Gallery</button>
      <button type="button" onclick={openModal} style="background-color: #d9534f; color: white;">Delete Image</button>
    </form>
  {/if}
  
  <!-- Confirmation Modal -->
  {#if state.showModal}
    <div class="modal-backdrop">
      <div class="modal">
        <p>Are you sure you want to delete this image? This action cannot be undone.</p>
        <button onclick={confirmDeleteImage} style="background-color: #d9534f; color: white;">Yes, Delete</button>
        <button onclick={closeModal} style="background-color: #f4f4f4; color: #555;">Cancel</button>
      </div>
    </div>
  {/if}
  
  <style>


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
    
      #quill-container {
        height: 350px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #fafafa;
        padding: 1rem;
        font-size: 1.1rem;
        font-family: 'Georgia', serif;
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