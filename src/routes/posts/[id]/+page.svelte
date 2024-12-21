
<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { slugify } from '$lib/utils/slugify.js';
    import { browser } from '$app/environment'; // Check if in the browser
  
    const pb = new PocketBase('http://127.0.0.1:8090');
  
    const state = $state({
      postId: null,
      title: '',
      slug: '',
      slugFixed: false,
      contents: '', // Quill editor content
      error: '',
      success: ''
    });
  
    let quill; // Variable for Quill instance
    let quillContainer; // Reference for Quill container
  
    import { page } from '$app/stores';
    const postId = $page.params.id;
  
    onMount(async () => {
      if (!browser) return; // Prevent SSR execution
  
      // Dynamically import Quill only in the browser
      const { default: Quill } = await import('quill');
  
      // Initialise Quill editor
      quill = new Quill(quillContainer, {
        theme: 'snow',
        placeholder: 'Write your post content here...'
      });
  
      // Sync Quill content to state.contents
      quill.on('text-change', () => {
        state.contents = quill.root.innerHTML;
      });
  
      // Load existing post if editing
      if (postId !== 'new') {
        try {
          const post = await pb.collection('posts').getOne(postId);
          state.postId = post.id;
          state.title = post.title;
          state.slug = post.slug;
          state.contents = post.contents;
          state.slugFixed = true;
  
          // Set initial content in Quill editor
          quill.root.innerHTML = state.contents;
        } catch (err) {
          console.error('Failed to fetch post:', err);
          state.error = 'Post not found.';
        }
      }
    });
  
    // Update slug as title is typed
    $effect(() => {
      if (!state.slugFixed) {
        state.slug = slugify(state.title);
      }
    });
  
    // Save or Update Post
    const savePost = async () => {
      state.error = '';
      state.success = '';
  
      const data = {
        title: state.title,
        slug: state.slug,
        contents: state.contents // Updated content from Quill
      };
  
      try {
        if (state.postId) {
          await pb.collection('posts').update(state.postId, data);
          state.success = 'Post updated successfully!';
        } else {
          const response = await pb.collection('posts').create(data);
          state.postId = response.id;
          state.success = 'Post created successfully!';
        }
      } catch (err) {
        console.error('Failed to save post:', err);
        state.error = 'Failed to save post.';
      }
    };
  </script>
  
  
  <h1>{state.postId ? 'Edit Post' : 'Create New Post'}</h1>
  
  <!-- Success/Error Messages -->
  {#if state.success}
    <p style="color: green;">{state.success}</p>
  {/if}
  {#if state.error}
    <p style="color: red;">{state.error}</p>
  {/if}
  
  <!-- Post Form -->
  <form onsubmit={(e) => { e.preventDefault(); savePost(); }}>
    <label for="title">Title:</label>
    <input id="title" type="text" bind:value={state.title} placeholder="Post Title" required />
  
    <label for="slug">Slug:</label>
    <input
      id="slug"
      type="text"
      bind:value={state.slug}
      oninput={() => (state.slugFixed = true)} 
      placeholder="Slug"
      required
    />      
  
    <label for="contents">Contents:</label>
    <div id="quill-container" bind:this={quillContainer}></div> <!-- Quill Container -->
  
    <button type="submit">{state.postId ? 'Update Post' : 'Create Post'}</button>
    <button type="button" onclick={() => goto('/dashboard')}>Back to dashboard</button>
  </form>
  
  
    <style>
  /* General Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

 
  h1 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 500;
    color: #3a3a3a;
    margin-bottom: 2rem;
    font-family: 'Playfair Display', serif; /* A refined, elegant serif */
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
    h1 {
      font-size: 2rem;
    }

    form {
      padding: 2rem;
    }

    input, button {
      font-size: 1rem;
    }
  }
</style>
