import { getJoke } from './src/jokes-core.js';

// This is an immediately-invoked async function
(async () => {
  try {
    // Call our core logic to get the joke
    const joke = await getJoke();
    // If it succeeds, print the joke
    console.log(joke);
  } catch (error) {
    // If it fails, print the error message
    console.error(`Error: ${error.message}`);
  }
})();