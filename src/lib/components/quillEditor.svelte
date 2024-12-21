<script>
    let { contents = '', onContentChange = () => {} } = $props();
  
    let quillContainer;
    let quill;
  
    $effect(() => {
      async function setupQuill() {
        const { default: Quill } = await import('quill');
  
        quill = new Quill(quillContainer, {
          theme: 'snow',
          placeholder: 'Write your post content here...',
        });
  
        quill.on('text-change', () => {
          const content = quill.root.innerHTML;
          onContentChange(content);
        });
  
        // Set initial content in the editor
        quill.root.innerHTML = contents;
      }
  
      setupQuill();
    });
  
    $effect(() => {
      if (quill && quill.root.innerHTML !== contents) {
        quill.root.innerHTML = contents;
      }
    });
  </script>
  
  <div id="quill-container" bind:this={quillContainer}></div>
  
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
  