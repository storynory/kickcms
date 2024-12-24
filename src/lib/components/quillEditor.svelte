<script>
 import { onMount } from 'svelte';
 import { browser } from '$app/environment';
 import {quillOptions} from "$lib/quillConfig.js"
 import {state} from "$lib/shared.svelte.js"

 
let {contents = ""} = $props()
  
    let quill; // Variable for Quill instance
    let quillContainer; // Reference for Quill container - I think this would be the shared state
    
    onMount(async () => {
        const { default: Quill } = await import('quill');
    quill = new Quill(quillContainer, quillOptions);
    // Update state contents on text change
    quill.on('text-change', () => {
        contents = quill.root.innerHTML;
    });
    quill.root.innerHTML = state.contents;
});

    
  </script>
  
  <div class="quill-container" bind:this={quillContainer}></div> <!-- Quill Container -->

 
<style>

  .quill-container {
    height: 350px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fafafa;
    padding: 1rem;
    font-size: 1.1rem;
    font-family: 'Georgia', serif;
  }

 

  

</style>
