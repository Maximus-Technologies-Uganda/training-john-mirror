const axios = require('axios');

// This is an "async" function, which means it can use "await"
async function getJoke() {
  try {
    // We "await" the response from the joke API
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any?type=single');
    console.log(response.data.joke);
  } catch (error) {
    console.error("Sorry, couldn't fetch a joke at this time.", error.message);
  }
}

getJoke();