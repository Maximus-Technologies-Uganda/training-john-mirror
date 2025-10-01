import { describe, it, expect, beforeAll } from 'vitest';
import { addExpense, summarizeExpenses } from '../src/expenses-core.js';
import { spawn } from 'child_process';
import path from 'path';

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
});

// Helper function to run CLI commands
function runCLI(args) {
  return new Promise((resolve) => {
    const child = spawn('node', [path.join(process.cwd(), 'src/expenses-core.js'), ...args], {
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
      name: 'should add expense successfully',
      args: ['add', 'Food', '25.50'],
      expectedExitCode: 0,
      expectedOutput: 'Added expense: Food - $25.5',
      shouldContain: true
    },
    {
      name: 'should show help when no command provided',
      args: [],
      expectedExitCode: 1,
      expectedOutput: 'You need to specify a command',
      shouldContain: true
    },
    {
      name: 'should show help with --help flag',
      args: ['--help'],
      expectedExitCode: 0,
      expectedOutput: 'Usage: expenses-core.js <command> [options]',
      shouldContain: true
    },
    {
      name: 'should reject add command without required arguments',
      args: ['add'],
      expectedExitCode: 1,
      expectedOutput: 'Not enough non-option arguments: got 0, need at least 2',
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
  // Setup test data by adding some expenses first
  beforeAll(async () => {
    // Add test expenses for different months and categories
    await runCLI(['add', 'Food', '10.00']);
    await runCLI(['add', 'Transport', '5.00']);
    await runCLI(['add', 'Food', '15.00']);
  });

  const filteringTestCases = [
    {
      name: 'should show summary without filters',
      args: ['summary'],
      expectedExitCode: 0,
      expectedOutput: 'Expense Summary:',
      shouldContain: true
    },
    {
      name: 'should filter by valid month',
      args: ['summary', '--month', '10'], // October (current month)
      expectedExitCode: 0,
      expectedOutput: 'Expense Summary for October:',
      shouldContain: true
    },
    {
      name: 'should show empty summary for different month',
      args: ['summary', '--month', '1'], // January
      expectedExitCode: 0,
      expectedOutput: 'Total: $0.00',
      shouldContain: true
    },
    {
      name: 'should list all expenses',
      args: ['list'],
      expectedExitCode: 0,
      expectedOutput: 'All Expenses:',
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
