import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import { pathToFileURL } from 'url';

describe('CLI month flag validation (invalid month)', () => {
  it('prints error and exits(1) when --month is 13', async () => {
    const moduleFsPath = path.join(process.cwd(), 'src/expense-cli.js');
    const moduleFileUrl = pathToFileURL(moduleFsPath).href;

    const originalArgv = process.argv.slice();
    const originalExit = process.exit;
    const originalConsoleError = console.error;

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      process.argv = ['node', moduleFsPath, 'summary', '--month', '13'];
      // Force a fresh import so the module body (and CLI gate) executes
      await import(`${moduleFileUrl}?t=${Date.now()}`);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --month must be a number between 1 and 12');
      expect(exitSpy).toHaveBeenCalledWith(1);
    } finally {
      // Restore globals
      process.argv = originalArgv;
      // @ts-expect-error restoring mocked function
      process.exit = originalExit;
      console.error = originalConsoleError;

      exitSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    }
  });
});


