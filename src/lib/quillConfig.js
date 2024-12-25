export const quillOptions = {
    theme: 'snow',
    placeholder: 'Write here...',
    modules: {
        toolbar: [
            [{ size: ['small', false, 'large', 'huge'] }], // Font sizes
            ['bold', 'italic', 'underline', 'strike'], // Formatting
            [{ color: [] }, { background: [] }], // Text and background colours
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'], // Media
            ['clean'], // Remove formatting
        ],
    },
};