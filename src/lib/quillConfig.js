export const quillOptions = {
    theme: 'snow',
    placeholder: 'Write here...',
    modules: {
        toolbar: {
            container: [
                [{ size: ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'], // Image button
                ['clean'],
            ],
            handlers: {
                image: function () {
                    // This will be overridden in the component
                },
            },
        },
    },
};
