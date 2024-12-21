// src/lib/utils/slugify.js
function slugify(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')    // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove non-word characters
      .replace(/\-\-+/g, '-')   // Replace multiple dashes with single dash
      .replace(/^-+|-+$/g, ''); // Trim dashes
  }
  
  export { slugify };