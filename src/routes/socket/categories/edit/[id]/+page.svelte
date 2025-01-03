<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { pb } from '$lib/pocketbase.svelte.js';
    import { quillOptions } from "$lib/quillConfig.js";
  
    const state = $state({
      postId: null,
      title: '',
      description: '',
      error: '',
      success: '',
      showModal: false // Track modal visibility
    });
  
    let quill; // Quill instance
    let quillContainer; // Reference to Quill container
    import { page } from '$app/stores';
    const postId = $page.params.id;
  
    onMount(async () => {
      if (!browser) return;
  
      const { default: Quill } = await import('quill');
      quill = new Quill(quillContainer, quillOptions);
  
      quill.on('text-change', () => {
        state.description = quill.root.innerHTML;
      });
  
      if (postId !== 'new') {
        try {
          const cat = await pb.collection('categories').getOne(postId);
          state.postId = cat.id;
          state.title = cat.title;
          state.description = cat.description;
  
          quill.root.innerHTML = state.description;
        } catch (err) {
          console.error('Failed to fetch category:', err);
          state.error = 'Category not found.';
        }
      }
    });
  
    const savePost = async () => {
      state.error = '';
      state.success = '';
  
      const data = {
        title: state.title,
        description: state.description
      };
  
      try {
        if (state.postId) {
          await pb.collection('categories').update(state.postId, data);
          state.success = 'Category updated successfully!';
        } else {
          const response = await pb.collection('categories').create(data);
          state.postId = response.id;
          state.success = 'Category created successfully!';
        }
      } catch (err) {
        console.error('Failed to save category:', err);
        state.error = 'Failed to save category.';
      }
    };
  
    // Modal-related functions
    const openModal = () => (state.showModal = true);
    const closeModal = () => (state.showModal = false);
  
    const confirmDeletePost = async () => {
      closeModal();
      state.error = '';
      state.success = '';
  
      try {
        await pb.collection('categories').delete(state.postId);
        state.success = 'Category deleted successfully!';
        goto('/dashboard');
      } catch (err) {
        console.error('Failed to delete category:', err);
        state.error = 'Failed to delete category.';
      }
    };
  
    function handleKeydown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        savePost();
      }
    }
  </script>
  <svelte:window on:keydown={handleKeydown} />
  <h1>{state.postId ? 'Edit Category' : 'Create New Category'}</h1>

<!-- Success/Error Messages -->
{#if state.success}
  <p style="color: green;">{state.success}</p>
{/if}
{#if state.error}
  <p style="color: red;">{state.error}</p>
{/if}

<!-- Form -->
<form onsubmit={(e) => { e.preventDefault(); savePost(); }}>
  <label for="title">Title:</label>
  <input id="title" type="text" bind:value={state.title} placeholder="Category Title" required />

  <label for="description">Description:</label>
  <div id="quill-container" bind:this={quillContainer}></div>

  <button type="submit">{state.postId ? 'Update Category' : 'Create Category'}</button>
  <button type="button" onclick={() => goto('/dashboard')}>Back to dashboard</button>
  {#if state.postId}
    <button type="button" onclick={openModal} style="background-color: #d9534f; color: white;">Delete Category</button>
  {/if}
</form>

<!-- Confirmation Modal -->
{#if state.showModal}
  <div class="modal-backdrop">
    <div class="modal">
      <p>Are you sure you want to delete this category? This action cannot be undone.</p>
      <button onclick={confirmDeletePost} style="background-color: #d9534f; color: white;">Yes, Delete</button>
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