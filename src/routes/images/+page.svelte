<script>
   import { pb, userState } from '$lib/pocketbase.svelte.js'; // Import PocketBase instance and user state
   import { imageresize,imagesq } from '$lib/images.js';
   import { searchdata} from './sharedImages.svelte.js';
   import Pagination from "./ImagePaginate.svelte";
   import { onMount } from 'svelte';
   import Fuse from 'fuse.js';
   import Search from './imageSearch.svelte'

 // import {performSearch } from './imageHelpers.js';
    searchdata.pagenum = 1;
    let images = $props();
    
    let gridimages = images.data.images.items;
    searchdata.gridimages =  gridimages;
    searchdata.pics = gridimages;
    // $inspect("images page", images.data)
    searchdata.query = "";
    searchdata.pageInfo = images.data.images;
   

  // Perform search on posts
 
 
  let fuse; // Declare Fuse instance
  let allpics = []; // Store all images

  // Initialize Fuse.js on mount
  
    let selectedFile = null;
  
    // Handle file selection
    function onFileSelect(event) {
      selectedFile = event.target.files[0];
    }
  
    // Handle file upload
    async function uploadFile() {
      if (!selectedFile) {
        alert("Please select a file to upload.");
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
 


  <!-- Display images -->

  <h1>Image Gallery</h1>


  <Search />
  {#if  searchdata.showPagination === true}
  <Pagination initialImages={images}/>
  {/if}
  <style>
    /* General Styling */
    h1 {
      text-align: center;
      margin: 20px 0;
      font-size: 2.5rem;
      color: #444;
    }
  
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
  
    /* No Images Message */
    .no-images {
      text-align: center;
      font-size: 1.2rem;
      color: #777;
      margin: 20px 0;
    }
  
   
  </style>