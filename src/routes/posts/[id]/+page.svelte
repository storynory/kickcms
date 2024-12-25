<script>
  
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { slugify } from '$lib/utils/slugify.js';
    import { page } from '$app/stores';
    import { quillOptions } from "$lib/quillConfig.js";
    import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
   //import Editor from "$lib/components/quillEditor.svelte"
  

    const state = $state({
        postId: null,
        title: '',
        slug: '',
        slugFixed: false,
        contents: '',
        error: '',
        success: '',
        excerpt: "",
        showModal: false // Track modal visibility
    });
    const postId = $page.params.id;
    let quillContainer; // Reference for Quill container

    onMount(async () => {
      const { default: Quill } = await import('quill');
       let quill = new Quill(quillContainer, quillOptions);
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
                state.excerpt = post.excerpt;
                quill.root.innerHTML = post.contents;
            } catch (err) {
                setFeedback('error', 'Post not found.');
            }
        }

    });

   

    const setFeedback = (type, message) => {
        state[type] = message;
        setTimeout(() => (state[type] = ''), 3000); // Clear message after 3 seconds
    };

    const handleRequest = async (fn, successMessage, errorMessage) => {
        try {
            await fn();
            setFeedback('success', successMessage);
        } catch (err) {
            console.error(errorMessage, err);
            setFeedback('error', errorMessage);
        }
    };


 

let lastSavedState = {}; // To track the last saved post state

const savePost = () => {
    // Current state to compare
    const currentState = {
        title: state.title,
        slug: state.slug,
        contents: state.contents,
        excerpt: state.excerpt,
    };

    // Check if the current state differs from the last saved state
    if (JSON.stringify(currentState) !== JSON.stringify(lastSavedState))  {
        handleRequest(
            async () => {
                if (state.postId) {
                    await pb.collection('posts').update(state.postId, currentState);
                } else {
                    const createdPost = await pb.collection('posts').create(currentState);
                    state.postId = createdPost.id;
                }
                lastSavedState = { ...currentState }; // Update the last saved state
            },
            'Post saved successfully!',
            'Failed to save post.'
        );
    } else {
        console.log("No changes detected, skipping save.");
    }
};

    // Modal-related functions
    const openModal = () => (state.showModal = true);
    const closeModal = () => (state.showModal = false);

    const confirmDeletePost = () => handleRequest(
        async () => {
            await pb.collection('posts').delete(state.postId);
            goto('/dashboard');
        },
        'Post deleted successfully!',
        'Failed to delete post.'
    );

    // Automatically update slug as title is typed
    $effect(() => {
        if (!state.slugFixed) {
            state.slug = slugify(state.title);
        }
    });

    // Save post on key press (Ctrl+S or Cmd+S)
    function handleKeydown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            savePost();
        }
    }
    setInterval(savePost, 30000);
    
</script>

<svelte:window onkeydown={handleKeydown} />
<main >

<div class="message">    
<!-- Success/Error Messages -->
{#if state.success}
  <p style="color: green;">{state.success}</p>
{/if}
{#if state.error}
  <p style="color: red;">{state.error}</p>
{/if}
</div>

<h1>{state.postId ? 'Edit Post' : 'Create New Post'}</h1>

<!-- Post Form -->
<form  onsubmit={(e) => { e.preventDefault(); savePost(); }}>
  
    <button class="save" type="submit">{state.postId ? 'Update Post' : 'Create Post'}</button>
    
    <label for="title">
        <span>Title:</span>
        <input class="h1"
         id="title" type="text" 
         bind:value={state.title} 
         placeholder="Post Title Here" required />
  
    </label>
    
  
    <label for="excerpt">
        <span>Excerpt:</span>
    <textarea
        id="excerpt"
        bind:value={state.excerpt}
        placeholder="Short summary or introduction"
        rows="3"
    ></textarea>
    </label>
    

    <label for="quill-container">
        <span class="ql">Contents:</span>
    <div id="quill-container" bind:this={quillContainer}  tabindex="0" role="textbox" aria-multiline="true" ></div>
    </label>


    <label for="slug">
        <span>Slug:</span>
    <input
        id="slug"
        type="text"
        bind:value={state.slug}
        oninput={() => (state.slugFixed = true)}
        placeholder="Slug"
        required
    /></label>


  
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
</main>
<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #f9f9f9;
    }

    button.save {
        margin-bottom: 2rem;
    }

    form {
        width: 100%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }



    label {
        margin-bottom: 1rem;
    }

    label > span {
        font-weight: bold;
        display: block;
        margin-bottom: 0rem;
    }

    span.ql {
        padding-bottom: 0.5rem;
        padding-top: 1rem;
    }

    input,
    textarea,
    #quill-container

    {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 0.75rem;
        font-size: 1rem;
        margin-top: 0.5rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }

    input.h1 {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: centre;
    }

    #quill-container {
        height: 350px;
        font-size: 18px;
   
    }

    button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s;
        margin-top: 1rem;
    }

    button[type="submit"] {
        background-color: #8a4fff;
        color: white;
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

    p[style="color: green;"],
    p[style="color: red;"] {
        text-align: centre;
        font-weight: bold;
        margin-top: 1rem;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: centre;
        align-items: centre;
        z-index: 9999;
    }

    .modal {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        text-align: centre;
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

    .message {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    text-align: center;
}


.message p {
    margin: 0;
    font-weight: bold;
    font-size: 1rem;
}

#title {
    text-align: center;
}

#quill-container.focused {
    border-color: #8a4fff; /* Match the focus colour of inputs */
    box-shadow: 0 0 5px rgba(138, 79, 255, 0.5);
}

</style>
