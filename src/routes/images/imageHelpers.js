import {searchdata, imageData } from "./sharedImages.svelte.js"
import { pb } from '$lib/pocketbase.svelte.js';

export const saveImage = async (imageid, data) => {
    imageData.error = '';
    imageData.success = '';
  
    try {
      await pb.collection('images').update(imageid, data);
      imageData.success = 'Image updated successfully!';
    } catch (err) {
      console.error('Failed to save image:', err);
      imageData.error = 'Failed to save image.';
    }
  };


 export const confirmDeleteImage = async (imageid) => {
    closeModal();
    imageData.error = '';
    imageData.success = '';

    try {
      await pb.collection('images').delete(imageid);
      imageData.success = 'Image deleted successfully!';
      goto('/images');
    } catch (err) {
      console.error('Failed to delete image:', err);
      imageData.error = 'Failed to delete image.';
    }
  };

//************************* Image Gallery Functions */

  // Perform search on posts
 export const performSearch = (originalimages) => {
    if (searchdata.query.trim() === '') {
        searchdata.pics = originalimages;
    } else {
        searchdata.pics = originalimages.filter(
            post =>
                post.title.toLowerCase().includes( searchdata.query.toLowerCase())
             
        );
    }
    console.log("p search")
};
