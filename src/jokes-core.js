/* eslint-env browser */
import { NetworkJokeProvider } from './jokes-provider.js';

/**
 * Business logic for processing jokes - separated from network concerns
 */
class JokeService {
    constructor(provider) {
        this.provider = provider;
    }

    /**
     * Validates input parameters for joke requests
     * @param {string} category - The joke category
     * @param {string} type - The joke type
     * @throws {Error} If validation fails
     */
    validateInputs(category, type) {
        const validCategories = ['Any', 'Programming', 'Misc', 'Dark', 'Pun', 'Spooky', 'Christmas'];
        const validTypes = ['single', 'twopart'];
        
        if (!validCategories.includes(category)) {
            throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
        }
        
        if (!validTypes.includes(type)) {
            throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
        }
    }

    /**
     * Formats raw joke data into a standardized structure
     * @param {Object} jokeData - Raw joke data from the provider
     * @param {string} type - The joke type
     * @returns {Object} Formatted joke object
     */
    formatJoke(jokeData, type) {
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
    }

    /**
     * Fetches a random joke with enhanced functionality.
     * @param {string} category - The joke category (optional)
     * @param {string} type - The joke type ('single' or 'twopart')
     * @returns {Promise<Object>} A joke object with setup, punchline, and metadata
     */
    async getJoke(category = 'Any', type = 'single') {
        // Validate inputs
        this.validateInputs(category, type);
        
        // Fetch raw data from provider
        const jokeData = await this.provider.fetchJoke(category, type);
        
        // Format and return the joke
        return this.formatJoke(jokeData, type);
    }
}

// Create a default service instance with network provider
const defaultService = new JokeService(new NetworkJokeProvider());

/**
 * Fetches a random joke from the API with enhanced functionality.
 * @param {string} category - The joke category (optional)
 * @param {string} type - The joke type ('single' or 'twopart')
 * @returns {Promise<Object>} A joke object with setup, punchline, and metadata
 */
async function getJoke(category = 'Any', type = 'single') {
    return defaultService.getJoke(category, type);
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

/**
 * Creates a new JokeService instance with a custom provider
 * @param {JokeProvider} provider - The provider to use
 * @returns {JokeService} A new service instance
 */
function createJokeService(provider) {
    return new JokeService(provider);
}

// Export functions for ES modules
export {
    getJoke,
    getJokeString,
    getAvailableCategories,
    getAvailableTypes,
    createJokeService,
    JokeService
};