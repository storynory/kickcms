import {state} from "./imagestate.svelte.js"
import { pb } from '$lib/pocketbase.svelte.js';

export const saveImage = async (imageid, data) => {
    state.error = '';
    state.success = '';
  
    try {
      await pb.collection('images').update(imageid, data);
      state.success = 'Image updated successfully!';
    } catch (err) {
      console.error('Failed to save image:', err);
      state.error = 'Failed to save image.';
    }
  };


 export const confirmDeleteImage = async (imageid) => {
    closeModal();
    state.error = '';
    state.success = '';

    try {
      await pb.collection('images').delete(imageid);
      state.success = 'Image deleted successfully!';
      goto('/images');
    } catch (err) {
      console.error('Failed to delete image:', err);
      state.error = 'Failed to delete image.';
    }
  };

