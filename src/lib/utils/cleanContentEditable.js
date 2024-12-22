export function cleanContentEditable(html, allowedTags = ['b', 'strong', 'i', 'em', 'u', 'p', 'br']) {
    // Create a DOM parser to work with the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    // Recursive function to clean each node
    function cleanNode(node) {
        // Remove comments and unwanted node types
        if (node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.DOCUMENT_TYPE_NODE) {
            node.remove();
            return;
        }

        // If it's a text node, leave it as is
        if (node.nodeType === Node.TEXT_NODE) {
            return;
        }

        // If it's an element, check its tag
        if (node.nodeType === Node.ELEMENT_NODE) {
            // Remove disallowed tags
            if (!allowedTags.includes(node.tagName.toLowerCase())) {
                const parent = node.parentNode;
                while (node.firstChild) {
                    parent.insertBefore(node.firstChild, node);
                }
                parent.removeChild(node);
                return;
            }

            // Clean attributes (remove inline styles, classes, etc.)
            [...node.attributes].forEach(attr => {
                if (attr.name !== 'href' && attr.name !== 'src') {
                    node.removeAttribute(attr.name);
                }
            });

            // Recursively clean children
            [...node.childNodes].forEach(cleanNode);
        }
    }

    // Start cleaning from the root body
    [...body.childNodes].forEach(cleanNode);

    // Normalise the output HTML
    const normalisedHtml = body.innerHTML
        .replace(/<br\s*\/?>/g, '\n') // Convert <br> to line breaks
        .replace(/\n{2,}/g, '\n') // Remove multiple line breaks
        .trim(); // Remove extra spaces

    return normalisedHtml;
}
