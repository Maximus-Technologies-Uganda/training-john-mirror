import { describe, it, expect, beforeAll } from 'vitest';
import { addExpense, summarizeExpenses, getExpenses } from '../src/expense-core.js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

describe('addExpense function', () => {
  it('should add an expense to the list', () => {
    const expenses = [];
    const newExpense = addExpense(expenses, 'Food', 10);
    
    expect(newExpense).toHaveLength(1);
    expect(newExpense[0]).toMatchObject({
      category: 'Food',
      amount: 10
    });
    expect(newExpense[0]).toHaveProperty('date');
    expect(typeof newExpense[0].date).toBe('string');
    expect(newExpense[0].date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});

describe('summarizeExpenses function', () => {
  it('should correctly summarize a list of expenses', () => {
    const expenses = [
      { id: 1, category: 'Food', amount: 10 },
      { id: 2, category: 'Transport', amount: 5 },
      { id: 3, category: 'Food', amount: 15 }
    ];

    const summary = summarizeExpenses(expenses);

    // Check the total
    expect(summary.total).toBe(30);

    // Check the breakdown by category
    expect(summary.byCategory.Food).toBe(25);
    expect(summary.byCategory.Transport).toBe(5);
  });

  it('should return a total of 0 for an empty list', () => {
    const expenses = [];
    const summary = summarizeExpenses(expenses);
    expect(summary.total).toBe(0);
  });

  it('should coerce non-numeric amounts to zero', () => {
    const expenses = [
      { id: 1, category: 'Misc', amount: 'not-a-number' },
      { id: 2, category: 'Misc', amount: 'NaN' }
    ];

    const summary = summarizeExpenses(expenses);

    expect(summary.total).toBe(0);
    expect(summary.byCategory.Misc).toBe(0);
  });
});

describe('getExpenses validation', () => {
  const cases = [
    {
      name: 'rejects non-array expenses input',
      allExpenses: null,
      options: {},
      expected: {
        success: false,
        error: 'Expenses must be provided as an array.'
      }
    },
    {
      name: 'rejects invalid month option',
      allExpenses: [],
      options: { month: 13 },
      expected: {
        success: false,
        error: 'Error: --month must be a number between 1 and 12'
      }
    },
    {
      name: 'rejects empty category option',
      allExpenses: [],
      options: { category: '   ' },
      expected: {
        success: false,
        error: 'Category must be a non-empty string.'
      }
    }
  ];

  cases.forEach(({ name, allExpenses, options, expected }) => {
    it(name, () => {
      expect(getExpenses(allExpenses, options)).toEqual(expected);
    });
  });
});

function resolveCliPath() {
  const candidates = [
    path.join(process.cwd(), 'expenses/src/expense-cli.js'),
    path.join(process.cwd(), 'src/expense-cli.js')
  ];

  const matched = candidates.find((candidate) => fs.existsSync(candidate));

  if (!matched) {
    throw new Error('Unable to locate expense-cli.js');
  }

  return matched;
}

// Helper function to run CLI commands
function runCLI(args) {
  const cliPath = resolveCliPath();
  return new Promise((resolve) => {
    const child = spawn('node', [cliPath, ...args], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      resolve({
        exitCode: code,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });
  });
}

describe('CLI --month validation', () => {
  const testCases = [
    {
      name: 'should accept valid month (1)',
      args: ['summary', '--month', '1'],
      expectedExitCode: 0,
      expectedOutput: 'Expense Summary for January:',
      shouldContain: true
    },
    {
      name: 'should accept valid month (12)',
      args: ['summary', '--month', '12'],
      expectedExitCode: 0,
      expectedOutput: 'Expense Summary for December:',
      shouldContain: true
    },
    {
      name: 'should reject invalid month (0)',
      args: ['summary', '--month', '0'],
      expectedExitCode: 1,
      expectedOutput: 'Error: --month must be a number between 1 and 12',
      shouldContain: false
    },
    {
      name: 'should reject invalid month (13)',
      args: ['summary', '--month', '13'],
      expectedExitCode: 1,
      expectedOutput: 'Error: --month must be a number between 1 and 12',
      shouldContain: false
    },
    {
      name: 'should reject invalid month (-1)',
      args: ['summary', '--month', '-1'],
      expectedExitCode: 1,
      expectedOutput: 'Error: --month must be a number between 1 and 12',
      shouldContain: false
    },
    {
      name: 'should reject non-numeric month',
      args: ['summary', '--month', 'abc'],
      expectedExitCode: 1,
      expectedOutput: 'Error: --month must be a number between 1 and 12',
      shouldContain: false
    },
    {
      name: 'should work without month filter',
      args: ['summary'],
      expectedExitCode: 0,
      expectedOutput: 'Expense Summary:',
      shouldContain: true
    }
  ];

  testCases.forEach(({ name, args, expectedExitCode, expectedOutput, shouldContain }) => {
    it(name, async () => {
      const result = await runCLI(args);
      
      expect(result.exitCode).toBe(expectedExitCode);
      
      if (shouldContain) {
        expect(result.stdout).toContain(expectedOutput);
      } else {
        expect(result.stderr).toContain(expectedOutput);
      }
    });
  });
});

describe('CLI commands functionality', () => {
  const commandTestCases = [
    {
      name: 'should show summary when no arguments provided',
      args: [],
      expectedExitCode: 0,
      expectedOutput: 'Expense Summary:',
      shouldContain: true
    },
    {
      name: 'should show summary with category filter',
      args: ['--category', 'Food'],
      expectedExitCode: 0,
      expectedOutput: 'Category: Food',
      shouldContain: true
    },
    {
      name: 'should show help with --help flag',
      args: ['--help'],
      expectedExitCode: 0,
      expectedOutput: 'Usage: expenses [options]',
      shouldContain: true
    }
  ];

  commandTestCases.forEach(({ name, args, expectedExitCode, expectedOutput, shouldContain }) => {
    it(name, async () => {
      const result = await runCLI(args);
      
      expect(result.exitCode).toBe(expectedExitCode);
      
      if (shouldContain) {
        if (expectedExitCode === 0) {
          expect(result.stdout).toContain(expectedOutput);
        } else {
          expect(result.stderr).toContain(expectedOutput);
        }
      }
    });
  });
});

describe('CLI filtering functionality', () => {
  const filteringTestCases = [
    {
      name: 'should show summary without filters',
      args: [],
      expectedExitCode: 0,
      expectedOutput: 'Expense Summary:',
      shouldContain: true
    },
    {
      name: 'should filter by valid month',
      args: ['--month', '10'], // October (current month)
      expectedExitCode: 0,
      expectedOutput: 'Expense Summary for October:',
      shouldContain: true
    },
    {
      name: 'should show empty summary for different month',
      args: ['--month', '1'], // January
      expectedExitCode: 0,
      expectedOutput: 'Total: $0.00',
      shouldContain: true
    },
    {
      name: 'should filter by category only',
      args: ['--category', 'Transport'],
      expectedExitCode: 0,
      expectedOutput: 'Category: Transport',
      shouldContain: true
    }
  ];

  filteringTestCases.forEach(({ name, args, expectedExitCode, expectedOutput, shouldContain }) => {
    it(name, async () => {
      const result = await runCLI(args);

      expect(result.exitCode).toBe(expectedExitCode);

      if (shouldContain) {
        expect(result.stdout).toContain(expectedOutput);
      }
    });
  });
});
