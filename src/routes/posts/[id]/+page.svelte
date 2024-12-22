<script>
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { slugify } from '$lib/utils/slugify.js';
    import { browser } from '$app/environment';
    
    const pb = new PocketBase('http://127.0.0.1:8090');

    const state = $state({
        postId: null,
        title: '',
        slug: '',
        slugFixed: false,
        contents: '',
        error: '',
        success: '',
        showModal: false // Track modal visibility
    });

    let quill; // Variable for Quill instance
    let quillContainer; // Reference for Quill container

    import { page } from '$app/stores';
    const postId = $page.params.id;

    onMount(async () => {
    if (!browser) return;

    const { default: Quill } = await import('quill');
    const Delta = Quill.import('delta'); // Import Delta for custom clipboard behaviour

    quill = new Quill(quillContainer, {
        theme: 'snow',
        placeholder: 'Write your post content here...',
    });

    // Add custom clipboard matcher to respect line breaks as paragraphs
    quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
        const text = node.data;
        const lines = text.split('\n'); // Split text by line breaks
        const newDelta = new Delta();

        lines.forEach((line, index) => {
            if (line.trim() !== '') {
                newDelta.insert(line.trim()); // Add the text
                if (index < lines.length - 1) {
                    newDelta.insert('\n'); // Add a paragraph break
                }
            }
        });

        return newDelta;
    });

    // Update state contents on text change
    quill.on('text-change', () => {
        state.contents = quill.root.innerHTML;
    });

    // If editing an existing post, fetch and populate the data
    if (postId !== 'new') {
        try {
            const post = await pb.collection('posts').getOne(postId);
            state.postId = post.id;
            state.title = post.title;
            state.slug = post.slug;
            state.contents = post.contents;
            state.slugFixed = true;
            quill.root.innerHTML = state.contents;
        } catch (err) {
            console.error('Failed to fetch post:', err);
            state.error = 'Post not found.';
        }
    }
});

    const savePost = async () => {
        state.error = '';
        state.success = '';

        const data = {
            title: state.title,
            slug: state.slug,
            contents: state.contents
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

    // Modal-related functions
    const openModal = () => (state.showModal = true);
    const closeModal = () => (state.showModal = false);

    const confirmDeletePost = async () => {
        closeModal();
        state.error = '';
        state.success = '';

        try {
            await pb.collection('posts').delete(state.postId);
            state.success = 'Post deleted successfully!';
            goto('/dashboard');
        } catch (err) {
            console.error('Failed to delete post:', err);
            state.error = 'Failed to delete post.';
        }
    };

        // Update slug as title is typed
        $effect(() => {
      if (!state.slugFixed) {
        state.slug = slugify(state.title);
      }
    });
  

    // add press key to save
    function handleKeydown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            savePost();
        }
    }
  </script>
  <svelte:window onkeydown={handleKeydown} />

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
  {#if state.postId}
    <button type="button" onclick={openModal} style="background-color: #d9534f; color: white;">Delete Post</button>
  {/if}
</form>

<!-- Confirmation Modal -->
{#if state.showModal}
  <div class="modal-backdrop">
    <div class="modal">
      <p>Are you sure you want to delete this post? This action cannot be undone.</p>
      <button onclick={confirmDeletePost} style="background-color: #d9534f; color: white;">Yes, Delete</button>
      <button onclick={closeModal} style="background-color: #f4f4f4; color: #555;">Cancel</button>
    </div>
  </div>
{/if}

  
    <style>

 


  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 800px;
    width: 100%;
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

</style>
