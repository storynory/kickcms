<script>
 import { onMount } from 'svelte';
 import { browser } from '$app/environment';
 import {quillOptions} from "$lib/quillConfig.js"
 import {state} from "$lib/shared.svelte.js"

 
    let quill; // Variable for Quill instance
    let quillContainer; // Reference for Quill container - I think this would be the shared state

  
    onMount(async () => {
    if (!browser) return;

    const { default: Quill } = await import('quill');
    const Delta = Quill.import('delta'); // Import Delta for custom clipboard behaviour
    
    quill = new Quill(quillContainer, quillOptions);

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

    
  </script>
  
  <div id="quill-container" bind:this={quillContainer}></div> <!-- Quill Container -->

 
<style>

  #quill-container {
    height: 350px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fafafa;
    padding: 1rem;
    font-size: 1.1rem;
    font-family: 'Georgia', serif;
  }

 

  

</style>
