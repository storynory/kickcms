<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { slugify } from '$lib/utils/slugify.js';
    import { page } from '$app/stores';
    import { quillOptions } from '$lib/quillConfig.js';
    import { pb } from '$lib/pocketbase.svelte.js';

    const state = $state({
        postId: null,
        title: '',
        slug: '',
        slugFixed: false,
        contents: '',
        error: '',
        success: '',
        excerpt: '',
        featuredImage: null, // Featured image ID
        images: [], // Images for modal
        featuredImageData: null, // Featured image data
        showModal: false, // Modal visibility
        altText: '', // Featured image alt text
        imageTitle: '', // Featured image title
        isQuillImagePicker: false, // Track Quill vs. featured image modal
    });

    const postId = $page.params.id;
    let quillContainer;
    let quill;

    // Initialize Quill editor
    onMount(async () => {
        const { default: Quill } = await import('quill');
        quill = new Quill(quillContainer, {
            ...quillOptions,
            modules: {
                ...quillOptions.modules,
                toolbar: {
                    ...quillOptions.modules.toolbar,
                    handlers: {
                        image: () => openQuillImageModal(), // Quill image picker
                    },
                },
            },
        });

        quill.on('text-change', () => {
            state.contents = quill.root.innerHTML;
        });

        if (postId !== 'new') {
            await loadPostData(postId);
        }
    });

    // Load post data and featured image
    const loadPostData = async (postId) => {
        try {
            const post = await pb.collection('posts').getOne(postId);
            state.postId = post.id;
            state.title = post.title;
            state.slug = post.slug;
            state.contents = post.contents;
            state.slugFixed = true;
            state.excerpt = post.excerpt;
            state.featuredImage = post.featuredImage;

            if (state.featuredImage) {
                const imageData = await pb.collection('images').getOne(state.featuredImage);
                state.featuredImageData = imageData;
                state.altText = imageData.alt || '';
                state.imageTitle = imageData.title || '';
            }

            quill.root.innerHTML = post.contents;
        } catch {
            setFeedback('error', 'Post not found.');
        }
    };

    

    // Fetch and display images in modal
    const fetchImages = async () => {
        try {
            state.images = await pb.collection('images').getFullList({ limit: 50 });
        } catch {
            setFeedback('error', 'Failed to load images.');
        }
    };

    // Open modal for featured image
    const openModal = async () => {
        state.isQuillImagePicker = false;
        state.showModal = true;
        await fetchImages();
    };

    // Open modal for Quill image picker
    const openQuillImageModal = async () => {
        state.isQuillImagePicker = true;
        state.showModal = true;
        await fetchImages();
    };

    // Close the modal
    const closeModal = () => {
        state.showModal = false;
    };

    const formatImageData = (image) => ({
    url: `http://127.0.0.1:8090/api/files/${image.collectionId}/${image.id}/${image.image}?thumb=600x0`,
    id: image.id,
    title: image.title || 'Untitled',
    alt: image.alt || '', // Include alt text in formatted data
});

const selectImage = async (imageId) => {
    try {
        const imageData = await pb.collection('images').getOne(imageId);
        const imageUrl = `http://127.0.0.1:8090/api/files/${imageData.collectionId}/${imageData.id}/${imageData.image}?thumb=600x0`;

        if (state.isQuillImagePicker) {
            insertImageIntoQuill(imageUrl, imageData.alt);
        } else {
            // Update featured image metadata and UI
            state.featuredImage = imageId;
            state.featuredImageData = imageData;
            state.altText = imageData.alt || '';
            state.imageTitle = imageData.title || '';
            closeModal();
        }
    } catch {
        setFeedback('error', 'Failed to select image.');
    }
};
const insertImageIntoQuill = (url, alt) => {
    const range = quill.getSelection();
    if (range) {
        // Insert image HTML into Quill with alt and width
        const imageHtml = `<img src="${url}" alt="${alt || ''}" width="600" />`;
        quill.clipboard.dangerouslyPasteHTML(range.index, imageHtml);
        closeModal();
    } else {
        setFeedback('error', 'Select a position in the editor to insert the image.');
    }
};

    // Save post
    const savePost = async () => {
        const currentState = {
            title: state.title,
            slug: state.slug,
            contents: state.contents,
            excerpt: state.excerpt,
            featuredImage: state.featuredImage,
        };

        await handleRequest(
            async () => {
                if (state.postId) {
                    await pb.collection('posts').update(state.postId, currentState);
                } else {
                    const createdPost = await pb.collection('posts').create(currentState);
                    state.postId = createdPost.id;
                }

                if (state.featuredImageData) {
                    await pb.collection('images').update(state.featuredImage, {
                        alt: state.altText,
                        title: state.imageTitle,
                    });
                }
            },
            'Post saved successfully!',
            'Failed to save post.'
        );
    };

    const setFeedback = (type, message) => {
        state[type] = message;
        setTimeout(() => (state[type] = ''), 3000);
    };

    const handleRequest = async (fn, successMessage, errorMessage) => {
        try {
            await fn();
            setFeedback('success', successMessage);
        } catch {
            setFeedback('error', errorMessage);
        }
    };
</script>

<main>
    <div class="message">
        {#if state.success}
            <p style="color: green;">{state.success}</p>
        {/if}
        {#if state.error}
            <p style="color: red;">{state.error}</p>
        {/if}
    </div>

    <h1>{state.postId ? 'Edit Post' : 'Create New Post'}</h1>

    <form onsubmit={(e) => { e.preventDefault(); savePost(); }}>
        <button class="save" type="submit">{state.postId ? 'Update Post' : 'Create Post'}</button>

        <label for="title">
            <span>Title:</span>
            <input class="h1" id="title" type="text" bind:value={state.title} placeholder="Post Title Here" required />
        </label>

        <label for="excerpt">
            <span>Excerpt:</span>
            <textarea id="excerpt" bind:value={state.excerpt} placeholder="Short summary" rows="3"></textarea>
        </label>

        <label for="quill-container">
            <span class="ql">Contents:</span>
            <div id="quill-container" bind:this={quillContainer} tabindex="0" role="textbox" aria-multiline="true"></div>
        </label>

        <label for="slug">
            <span>Slug:</span>
            <input id="slug" type="text" bind:value={state.slug} oninput={() => (state.slugFixed = true)} placeholder="Slug" required />
        </label>

        <button type="button" onclick={openModal}>Select Featured Image</button>
        {#if state.featuredImageData}
            <div class="thumbnail-preview">
                <img
                    src={`http://127.0.0.1:8090/api/files/${state.featuredImageData.collectionId}/${state.featuredImageData.id}/${state.featuredImageData.image}?thumb=300x300`}
                    alt={state.altText}
                />
                <label>Alt Text:</label>
                <input type="text" bind:value={state.altText} placeholder="Alt text" />
                <label>Image Title:</label>
                <input type="text" bind:value={state.imageTitle} placeholder="Image title" />
            </div>
        {/if}
    </form>

    <!-- Modal -->
    {#if state.showModal}
        <div class="modal-backdrop">
            <div class="modal">
                <h2>Select an Image</h2>
                <div class="image-grid">
                    {#each state.images as image}
                        <button
                            class="image-button"
                            aria-label={`Select image: ${image.title || 'Untitled'}`}
                            onclick={() => selectImage(image.id)}
                        >
                            <img 
                                src={`http://127.0.0.1:8090/api/files/${image.collectionId}/${image.id}/${image.image}?thumb=300x300`} 
                                alt={image.title || 'Image'} 
                                class="image-item"
                            />
                        </button>
                    {/each}
                </div>
                <button onclick={closeModal}>Close</button>
            </div>
        </div>
    {/if}
</main>

<style>
     .thumbnail-preview {
        margin-top: 1rem;
        text-align: center;
    }

    .thumbnail-preview img {
        width: 300px;
        height: 300px;
        object-fit: cover;
        border: 2px solid #ddd;
        border-radius: 8px;
    }

    .thumbnail-preview input {
        display: block;
        margin: 0.5rem auto;
        width: 80%;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 1rem;
    }

    .image-item {
        width: 100%;
        height: auto;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border 0.3s;
    }

    .image-item:hover {
        border: 2px solid #4CAF50;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        max-width: 600px;
        width: 90%;
    }
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