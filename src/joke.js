import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { getJoke } from './jokes-core.js';
const argv = yargs(hideBin(process.argv)).argv;

// Get the category from the command line, or default to 'Any'
const category = argv.category || 'Any';
const jokeType = 'single'; // We only want single-part jokes

async function fetchAndDisplayJoke() {
  try {
    console.log(`Fetching a joke from the '${category}' category...`);
    const joke = await getJoke(category, jokeType);
    
    if (joke.error) {
      // The API sends an error field if the category is bad
      console.error('Error: Could not find jokes for that category.');
    } else {
      console.log(`\n${joke.formatted}`);
    }
  } catch (error) {
    console.error("Sorry, there was a problem connecting to the API.", error.message);
  }
}

fetchAndDisplayJoke();