// Function to serialize non-plain-old JavaScript objects (non-POJOs)
function serializeNonPOJOs(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Function to sanitise user input by escaping special HTML characters
function sanitiseInput(input) {
    if (typeof input !== 'string') {
        throw new TypeError('Input must be a string');
    }

    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };

    return input.replace(/[&<>"']/g, char => escapeMap[char]);
}

// Function to unescape sanitised input back to its original form
function unescapeInput(input) {
    if (typeof input !== 'string') {
        throw new TypeError('Input must be a string');
    }

    const unescapeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
    };

    return input.replace(/&(amp|lt|gt|quot|#39);/g, entity => unescapeMap[entity]);
}

// Combined function for serialising and sanitising an object
function serializeAndSanitise(obj) {
    const plainObj = serializeNonPOJOs(obj);
    for (const key in plainObj) {
        if (typeof plainObj[key] === 'string') {
            plainObj[key] = sanitiseInput(plainObj[key]);
        }
    }
    return plainObj;
}

// Exporting all functions separately for modular use
export {
    serializeNonPOJOs,
    sanitiseInput,
    unescapeInput,
    serializeAndSanitise,
};
