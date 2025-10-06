const path = require('path');

jest.mock('axios', () => ({
  get: jest.fn()
}));

jest.mock('yargs/yargs', () => {
  const yargsMock = jest.fn(() => ({ argv: yargsMock.argv }));
  yargsMock.argv = {};
  yargsMock.__setArgv = (nextArgv) => {
    yargsMock.argv = nextArgv;
  };
  return yargsMock;
});
jest.mock('yargs/helpers', () => ({ hideBin: jest.fn((args) => args) }));

const axios = require('axios');
const yargs = require('yargs/yargs');
const jokesCore = require('../src/jokes-core.js');

const cliPath = path.join(__dirname, '../src/joke.js');

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

const runCli = async (argvOverrides = {}) => {
  yargs.__setArgv(argvOverrides);
  jest.isolateModules(() => {
    require(cliPath);
  });
  await flushPromises();
};

describe('jokes CLI', () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('prints the joke from a successful API response', async () => {
    const jokeText = "Why don't scientists trust atoms? Because they make up everything!";

    axios.get.mockResolvedValue({
      data: {
        error: false,
        joke: jokeText
      }
    });

    await runCli({ category: 'Programming' });

    expect(axios.get).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Programming?type=single');
    expect(logSpy).toHaveBeenNthCalledWith(1, "Fetching a joke from the 'Programming' category...");
    expect(logSpy).toHaveBeenNthCalledWith(2, `\n${jokeText}`);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('logs an error message when the API request fails', async () => {
    const errorMessage = 'Request failed with status code 500';

    axios.get.mockRejectedValue(new Error(errorMessage));

    await runCli();

    expect(axios.get).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Any?type=single');
    expect(logSpy).toHaveBeenNthCalledWith(1, "Fetching a joke from the 'Any' category...");
    expect(errorSpy).toHaveBeenCalledWith(
      'Sorry, there was a problem connecting to the API.',
      errorMessage
    );
  });
});

describe('jokes-core API interactions', () => {
  const jokeApiBase = 'https://v2.jokeapi.dev/joke/';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('returns formatted single joke data when fetch succeeds', async () => {
    const mockJson = {
      error: false,
      category: 'Programming',
      type: 'single',
      joke: 'Some witty single line'
    };

    const jsonMock = jest.fn().mockResolvedValue(mockJson);
    global.fetch.mockResolvedValue({ ok: true, status: 200, json: jsonMock });

    const result = await jokesCore.getJoke('Programming', 'single');

    expect(global.fetch).toHaveBeenCalledWith(`${jokeApiBase}Programming?type=single`);
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      setup: mockJson.joke,
      punchline: '',
      category: 'Programming',
      type: 'single',
      formatted: mockJson.joke
    });
  });

  it('returns formatted two-part joke when fetch succeeds', async () => {
    const mockJson = {
      error: false,
      category: 'Misc',
      type: 'twopart',
      setup: 'Setup line',
      delivery: 'Punchline here'
    };

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockJson)
    });

    const result = await jokesCore.getJoke('Misc', 'twopart');

    expect(global.fetch).toHaveBeenCalledWith(`${jokeApiBase}Misc?type=twopart`);
    expect(result.formatted).toBe('Setup line\nPunchline here');
    expect(result).toMatchObject({
      setup: 'Setup line',
      punchline: 'Punchline here',
      type: 'twopart'
    });
  });

  it('throws when fetch response is not ok', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });

    await expect(jokesCore.getJoke('Any', 'single')).rejects.toThrow('Failed to fetch joke from the API. Status: 500');
  });

  it('throws when API payload indicates error', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ error: true, message: 'Bad stuff' })
    });

    await expect(jokesCore.getJoke('Any', 'single')).rejects.toThrow('API Error: Bad stuff');
  });

  it('throws for invalid category without calling fetch', async () => {
    await expect(jokesCore.getJoke('InvalidCat', 'single')).rejects.toThrow('Invalid category. Must be one of: Any, Programming, Misc, Dark, Pun, Spooky, Christmas');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('throws for invalid type without calling fetch', async () => {
    await expect(jokesCore.getJoke('Any', 'triple')).rejects.toThrow('Invalid type. Must be one of: single, twopart');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

