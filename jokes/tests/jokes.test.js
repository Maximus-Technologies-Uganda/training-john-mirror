import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('axios', () => {
  const get = vi.fn();
  return {
    __esModule: true,
    default: { get },
    get
  };
});

vi.mock('yargs/yargs', () => {
  const yargsMock = vi.fn(() => ({ argv: yargsMock.argv }));
  yargsMock.argv = {};
  yargsMock.__setArgv = (nextArgv) => {
    yargsMock.argv = nextArgv;
  };
  return {
    __esModule: true,
    default: Object.assign(yargsMock, { __setArgv: yargsMock.__setArgv })
  };
});

vi.mock('yargs/helpers', () => ({ hideBin: vi.fn((args) => args) }));

const { default: axios } = await import('axios');
const { default: yargs } = await import('yargs/yargs');
const { run: runCli } = await import('../src/joke.js');
const jokesCore = await import('../src/jokes-core.js');

const createParsedYargs = (argv = {}) => ({
  argv,
  option: vi.fn().mockImplementation(() => createParsedYargs(argv)),
  parse: vi.fn().mockImplementation(() => argv)
});

describe('jokes CLI', () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
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

    yargs.mockImplementation(() => createParsedYargs({ category: 'Programming' }));
    await runCli(['node', 'joke.js']);

    expect(axios.get).toHaveBeenCalledWith('https://v2.jokeapi.dev/joke/Programming?type=single');
    expect(logSpy).toHaveBeenNthCalledWith(1, "Fetching a joke from the 'Programming' category...");
    expect(logSpy).toHaveBeenNthCalledWith(2, `\n${jokeText}`);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('logs an error message when the API request fails', async () => {
    const errorMessage = 'Request failed with status code 500';

    axios.get.mockRejectedValue(new Error(errorMessage));

    yargs.mockImplementation(() => createParsedYargs({}));
    await runCli(['node', 'joke.js']);

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
    global.fetch = vi.fn();
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

    const jsonMock = vi.fn().mockResolvedValue(mockJson);
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
      json: vi.fn().mockResolvedValue(mockJson)
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
      json: vi.fn().mockResolvedValue({ error: true, message: 'Bad stuff' })
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

