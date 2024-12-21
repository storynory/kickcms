export async function load({ fetch }) {
    try {
      const response = await fetch('/images');
  
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status}`);
      }
  
      const { images } = await response.json();
      
  
      return { props: { images } };
    } catch (error) {
      console.error('Failed to load images:', error);
      return { props: { images: [] } };
    }
  }
  