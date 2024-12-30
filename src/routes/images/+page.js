export async function load({ fetch }) {
    try {
        const response = await fetch('/images');

        if (!response.ok) {
            throw new Error(`Failed to fetch images: ${response.status}`);
        }

        // Destructure the images from the response JSON
        const { images } = await response.json();

        // Export data in the consistent format
        return { images  };
    } catch (error) {
        console.error('Failed to load images:', error);

        // Return an empty array in case of an error
        return {images: []  };
    }
}
