import { pb, pblocation, userState, imageresize } from '$lib/pocketbase.svelte.js';
import { error } from '@sveltejs/kit';

export async function load({ params }){
    try {
        const image = await pb.collection('images').getOne(params.id);
    

        return {
            title: image.title,
            alt: image.alt,
            id: image.id,
            file: image.image,
        }
    } catch (err) {
        error(err, {
			message: 'Not found'
		});

    }
};