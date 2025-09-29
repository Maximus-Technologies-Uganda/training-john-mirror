/**
 * Abstract interface for joke data providers
 * This allows us to inject different implementations for testing vs production
 */
class JokeProvider {
    /**
     * Fetches a joke from the provider
     * @param {string} category - The joke category
     * @param {string} type - The joke type ('single' or 'twopart')
     * @returns {Promise<Object>} Raw joke data from the API
     * @throws {Error} When the request fails
     */
    async fetchJoke(category, type) {
        throw new Error('fetchJoke must be implemented by concrete provider');
    }
}

/**
 * Real network provider that makes actual HTTP requests
 */
class NetworkJokeProvider extends JokeProvider {
    constructor(baseUrl = 'https://v2.jokeapi.dev/joke/') {
        super();
        this.baseUrl = baseUrl;
    }

    async fetchJoke(category, type) {
        const apiUrl = `${this.baseUrl}${category}?type=${type}`;
        
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch joke from the API. Status: ${response.status}`);
            }
            
            const jokeData = await response.json();
            
            if (jokeData.error) {
                throw new Error(`API Error: ${jokeData.message || 'Unknown error'}`);
            }
            
            return jokeData;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to connect to the joke API. Please check your internet connection.');
            }
            throw error;
        }
    }
}

/**
 * Stub provider for testing - returns predictable data without network calls
 */
class StubJokeProvider extends JokeProvider {
    constructor() {
        super();
        this.jokes = {
            single: {
                joke: 'Why did the chicken cross the road?',
                category: 'Misc'
            },
            twopart: {
                setup: 'Why did the scarecrow win an award?',
                delivery: 'Because he was outstanding in his field!',
                category: 'Misc'
            }
        };
    }

    async fetchJoke(category, type) {
        // Simulate async behavior
        await new Promise(resolve => setTimeout(resolve, 10));
        
        if (this.shouldThrowError) {
            throw new Error(this.errorMessage || 'Simulated API error');
        }
        
        return this.jokes[type] || this.jokes.single;
    }

    /**
     * Configure the stub to throw an error
     * @param {boolean} shouldThrow - Whether to throw an error
     * @param {string} message - Error message to throw
     */
    setShouldThrowError(shouldThrow, message = 'Simulated API error') {
        this.shouldThrowError = shouldThrow;
        this.errorMessage = message;
    }

    /**
     * Set custom joke data for testing
     * @param {Object} jokeData - The joke data to return
     * @param {string} type - The joke type ('single' or 'twopart')
     */
    setJokeData(jokeData, type = 'single') {
        this.jokes[type] = jokeData;
    }
}

export {
    JokeProvider,
    NetworkJokeProvider,
    StubJokeProvider
};
