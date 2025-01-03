<script>
    import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
    import { searchdata } from './sharedImages.svelte.js';

    let selectedFile = null;

    // Maximum file size in bytes (e.g., 1MB)
    const MAX_FILE_SIZE = 1 * 1024 * 1024;

    // Supported file types
    const VALID_FILE_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/avif',
        'image/apng'
    ];

    // Handle file selection
    function onFileSelect(event) {
        const file = event.target.files[0];

        // Validate file type
        if (file && !VALID_FILE_TYPES.includes(file.type)) {
            alert("Invalid file type. Please upload an image in JPEG, PNG, GIF, WebP, SVG, AVIF, or APNG format.");
            return;
        }

        // Validate file size
        if (file && file.size > MAX_FILE_SIZE) {
            alert(`File size exceeds the limit of 1MB. Please upload a smaller file.`);
            return;
        }

        selectedFile = file;
    }

    // Handle file upload
    async function uploadFile() {
        if (!selectedFile) {
            alert("Please select a valid file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("title", selectedFile.name);
        formData.append("alt", "Uploaded image");

        try {
            if (!pb.authStore.isValid) {
                alert("You must be logged in to upload files.");
                return;
            }

            const newImage = await pb.collection('images').create(formData);
            searchdata.pics = [newImage, ...searchdata.pics]; // Add the new image to the top
            selectedFile = null;
     
        } catch (error) {
            console.error('Error uploading file:', error);
            alert("Error uploading the file. Please try again.");
        }
    }
</script>

<!-- Upload Section -->
<div class="upload-section">
    <input type="file" accept="image/*" onchange={onFileSelect} />
    <button onclick={uploadFile}>Upload</button>
</div>

<style>
    .upload-section {
        text-align: center;
    }

    .upload-section input {
        margin-right: 10px;
    }

    .upload-section button {
        padding: 10px 15px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .upload-section button:hover {
        background-color: #0056b3;
    }
</style>
