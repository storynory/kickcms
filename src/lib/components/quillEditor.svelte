<script>
    // import Editor from $lib/components/quillEditor.svelte

import {quillOptions} from "$lib/quillConfig.js"

let { field } = $props();


let quill; // Variable for Quill instance
let quillContainer; // Reference for Quill container
onMount(async () => {
    const { default: Quill } = await import('quill');
quill = new Quill(quillContainer, quillOptions);
// Sync Quill content 
    quill.on('text-change', () => {
        field = quill.root.innerHTML;
    });

});
</script>

<div id="quill-container" bind:this={quillContainer}></div> 

<!-- Quill Container
 
<Editor field={state.description} />
-->