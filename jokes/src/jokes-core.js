/* eslint-env browser */
/**
 * Fetches a random joke from the API with enhanced functionality.
 * @param {string} category - The joke category (optional)
 * @param {string} type - The joke type ('single' or 'twopart')
 * @returns {Promise<Object>} A joke object with setup, punchline, and metadata
 */
async function getJoke(category = 'Any', type = 'single') {
    // Validate inputs
    const validCategories = ['Any', 'Programming', 'Misc', 'Dark', 'Pun', 'Spooky', 'Christmas'];
    const validTypes = ['single', 'twopart'];
    
    if (!validCategories.includes(category)) {
        throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }
    
    if (!validTypes.includes(type)) {
        throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    }

    // Construct API URL
    const baseUrl = 'https://v2.jokeapi.dev/joke/';
    const apiUrl = `${baseUrl}${category}?type=${type}`;
    
    try {
        // Make a request to the joke API
        // eslint-disable-next-line no-undef
        const response = await fetch(apiUrl);
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`Failed to fetch joke from the API. Status: ${response.status}`);
        }
        
        // Parse the JSON response
        const jokeData = await response.json();
        
        // Check for API errors
        if (jokeData.error) {
            throw new Error(`API Error: ${jokeData.message || 'Unknown error'}`);
        }
        
        // Format the joke based on type
        if (type === 'single') {
            return {
                setup: jokeData.joke,
                punchline: '',
                category: jokeData.category,
                type: 'single',
                formatted: jokeData.joke
            };
        } else {
            return {
                setup: jokeData.setup,
                punchline: jokeData.delivery,
                category: jokeData.category,
                type: 'twopart',
                formatted: `${jokeData.setup}\n${jokeData.delivery}`
            };
        }
    } catch (error) {
        // Re-throw with more context
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to the joke API. Please check your internet connection.');
        }
        throw error;
    }
}

/**
 * Gets a formatted joke string (backward compatibility)
 * @param {string} category - The joke category (optional)
 * @returns {Promise<string>} A formatted joke string
 */
async function getJokeString(category = 'Any') {
    const joke = await getJoke(category, 'twopart');
    return joke.formatted;
}

/**
 * Gets available joke categories
 * @returns {Array<string>} Array of available categories
 */
function getAvailableCategories() {
    return ['Any', 'Programming', 'Misc', 'Dark', 'Pun', 'Spooky', 'Christmas'];
}

/**
 * Gets available joke types
 * @returns {Array<string>} Array of available types
 */
function getAvailableTypes() {
    return ['single', 'twopart'];
}

// Export functions for CommonJS
module.exports = {
    getJoke,
    getJokeString,
    getAvailableCategories,
    getAvailableTypes
};
