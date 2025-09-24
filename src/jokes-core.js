/**
 * Fetches a random joke from the API.
 * @returns {Promise<string>} A formatted joke string.
 */
export async function getJoke() {
    // Make a request to the joke API
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
  
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to fetch joke from the API.');
    }
  
    // Parse the JSON response into a JavaScript object
    const jokeData = await response.json();
  
    // Format the joke into a clean string and return it
    return `${jokeData.setup}\n${jokeData.punchline}`;
  }