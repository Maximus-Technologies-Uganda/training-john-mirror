const { spawnSync } = require('child_process');
const path = require('path');

describe('expenses CLI --month validation (Jest)', () => {
  test('prints error for invalid month (13)', () => {
    const cliPath = path.join(process.cwd(), 'expenses/src/expenses-core.js');
    const result = spawnSync('node', [cliPath, 'summary', '--month', '13'], {
      encoding: 'utf8'
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Error: --month must be a number between 1 and 12');
  });
});



