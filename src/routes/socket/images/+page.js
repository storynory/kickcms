export async function load({ fetch }) {
    try {
        const response = await fetch('/socket/images');

        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
        }

        // Destructure the images from the response JSON
        const { images, user } = await response.json();

        // Export data in the consistent format
        return { images, user  };
    } catch (error) {
        console.error('Failed to load images:', error);

        // Return an empty array in case of an error
        return {images: []  };
    }
}
