import axios from 'axios';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const BASE_URL = 'https://v2.jokeapi.dev/joke/';

/**
 * Run the jokes CLI.
 * @param {string[]} argv
 * @param {{ get: (url: string) => Promise<{ data: { error?: boolean, joke?: string, message?: string } }> }} httpClient
 * @param {(msg: string, ...args: any[]) => void} log
 * @param {(msg: string, ...args: any[]) => void} error
 * @returns {Promise<void>}
 */
export async function run(argv = process.argv, httpClient = axios, log = console.log, error = console.error) {
  const parsed = yargs(hideBin(argv)).option('category', {
    type: 'string',
    describe: 'Joke category (e.g., Programming, Misc)'
  }).parse();

  const category = parsed.category || 'Any';
  const jokeType = 'single';
  const apiUrl = `${BASE_URL}${category}?type=${jokeType}`;

  log(`Fetching a joke from the '${category}' category...`);
  try {
    const response = await httpClient.get(apiUrl);
    if (response?.data?.error) {
      error('Error: Could not find jokes for that category.');
      return;
    }
    log(`\n${response?.data?.joke ?? ''}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    error('Sorry, there was a problem connecting to the API.', message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run(process.argv).catch(() => {
    process.exitCode = 1;
  });
}
