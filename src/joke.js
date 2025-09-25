const axios = require('axios');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// The base URL for the API
const baseUrl = 'https://v2.jokeapi.dev/joke/';

// Get the category from the command line, or default to 'Any'
const category = argv.category || 'Any';
const jokeType = 'single'; // We only want single-part jokes

// Construct the final URL
const apiUrl = `${baseUrl}${category}?type=${jokeType}`;

async function getJoke() {
  try {
    console.log(`Fetching a joke from the '${category}' category...`);
    const response = await axios.get(apiUrl);
    
    if (response.data.error) {
      // The API sends an error field if the category is bad
      console.error('Error: Could not find jokes for that category.');
    } else {
      console.log(`\n${response.data.joke}`);
    }
  } catch (error) {
    console.error("Sorry, there was a problem connecting to the API.", error.message);
  }
}

getJoke();