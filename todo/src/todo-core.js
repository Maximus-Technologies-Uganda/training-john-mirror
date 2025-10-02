/**
 * Adds a new task to the list.
 * @param {Array<Object>} tasks - The array of task objects.
 * @param {string} taskName - The name/text of the new task.
 * @param {Date|null} dueDate - Optional due date for the task.
 * @returns {Array<Object>} A new array with the new task added.
 */
export function addTask(tasks, taskName, dueDate = null, priority = 'normal') {
  const newTask = {
    id: tasks.length + 1, // Simple ID generation
    text: taskName,
    done: false,
    dueDate,
    priority
  };
  return [...tasks, newTask];
}

/**
 * Marks a specific task as done.
 * @param {Array<Object>} tasks - The array of task objects.
 * @param {number} taskId - The ID of the task to mark as done.
 * @returns {Array<Object>} A new array with the updated task.
 */
export function markTaskDone(tasks, taskId) {
    return tasks.map(task => {
      if (task.id === taskId) {
        // If this is the task we're looking for, return a new object
        return { ...task, done: true };
      }
      // Otherwise, return the task unchanged
      return task;
    });
  }

/**
 * Removes a specific task from the list.
 * @param {Array<Object>} tasks - The array of task objects.
 * @param {number} taskId - The ID of the task to remove.
 * @returns {Array<Object>} A new array without the specified task.
 */
export function removeTask(tasks, taskId) {
  return tasks.filter(task => task.id !== taskId);
}

/**
 * Lists all tasks in the array.
 * @param {Array<Object>} tasks - The array of task objects.
 * @returns {Array<Object>} A copy of the tasks array.
 */
export function listTasks(tasks) {
  return [...tasks];
}

// Date utility functions for testing and CLI
export function getEndOfToday() {
  const now = new Date();
  // Use LOCAL date parts so end-of-day aligns with the user's local timezone
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return endOfDay;
}

/**
 * Checks if a task with the same text and due date already exists.
 * @param {Array<Object>} tasks - The array of existing tasks.
 * @param {string} taskText - The text of the new task.
 * @param {Date|null} dueDate - The due date of the new task.
 * @returns {boolean} True if a duplicate exists, false otherwise.
 */
export function isDuplicateTask(tasks, taskText, dueDate) {
  return tasks.some(task => {
    // Compare text (case-insensitive)
    const textMatches = task.text.toLowerCase() === taskText.toLowerCase();
    
    // Compare due dates
    let dueDateMatches = false;
    if (task.dueDate === null && dueDate === null) {
      dueDateMatches = true;
    } else if (task.dueDate && dueDate) {
      // Compare dates by converting to ISO strings for accurate comparison
      dueDateMatches = task.dueDate.toISOString() === dueDate.toISOString();
    }
    
    return textMatches && dueDateMatches;
  });
}

// CLI imports and functionality
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';

// Data persistence functions
const dataFile = path.join(process.cwd(), 'todos.json');

function loadTasks() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      const tasks = JSON.parse(data);
      // Convert dueDate strings back to Date objects
      return tasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null
      }));
    }
  } catch (error) {
    console.error('Error loading tasks:', error.message);
  }
  return [];
}

function saveTasks(tasks) {
  try {
    // Convert Date objects to strings for JSON storage
    const tasksForStorage = tasks.map(task => ({
      ...task,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null
    }));
    fs.writeFileSync(dataFile, JSON.stringify(tasksForStorage, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error.message);
  }
}

// CLI interface
function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options]')
    .command('add <task>', 'Add a new task', (yargs) => {
      return yargs
        .positional('task', {
          describe: 'Task description',
          type: 'string'
        });
    })
    .command('done <id>', 'Mark a task as done', (yargs) => {
      return yargs
        .positional('id', {
          describe: 'Task ID to mark as done',
          type: 'number'
        });
    })
    .command('remove <id>', 'Remove a task', (yargs) => {
      return yargs
        .positional('id', {
          describe: 'Task ID to remove',
          type: 'number'
        });
    })
    .command('list', 'List all tasks')
    .option('due', {
      alias: 'd',
      type: 'string',
      description: 'Set due date (e.g., "Today")',
      default: null
    })
    .option('dueToday', {
      type: 'boolean',
      description: 'Convenience flag to set due date to end of today (local)',
      default: false
    })
    .option('highPriority', {
      type: 'boolean',
      description: 'Mark the task as high priority',
      default: false
    })
    .help('h')
    .alias('h', 'help')
    .version()
    .example('$0 add "Buy groceries"', 'Add a new task')
    .example('$0 add "Buy groceries" --due Today', 'Add a task due today')
    .example('$0 add "Buy groceries" --dueToday', 'Add a task due today (local end-of-day)')
    .example('$0 add "Pay bills" --highPriority', 'Add a high priority task')
    .example('$0 done 1', 'Mark task 1 as done')
    .example('$0 list', 'List all tasks')
    .demandCommand(1, 'You need to specify a command')
    .argv;

  const command = argv._[0];
  const tasks = loadTasks();

  switch (command) {
    case 'add':
      const taskText = argv.task;
      let dueDate = null;
      const priority = argv.highPriority ? 'high' : 'normal';
      
      // Handle --dueToday or --due Today flag
      if (argv.dueToday === true) {
        dueDate = getEndOfToday();
      } else if (argv.due === 'Today') {
        dueDate = getEndOfToday();
      } else if (argv.due) {
        console.error('Error: Only "Today" is supported for --due flag');
        process.exit(1);
      }
      
      // Check for duplicates before adding
      if (isDuplicateTask(tasks, taskText, dueDate)) {
        const dueInfo = dueDate ? ` (due: ${dueDate.toLocaleDateString()})` : '';
        console.log(`⚠️  Task already exists: "${taskText}"${dueInfo}`);
        console.log('   No duplicate task was added.');
        break;
      }
      
      const updatedTasks = addTask(tasks, taskText, dueDate, priority);
      saveTasks(updatedTasks);
      
      const priorityInfo = priority === 'high' ? ' [HIGH]' : '';
      if (dueDate) {
        console.log(`Added task: "${taskText}"${priorityInfo} (due: ${dueDate.toLocaleDateString()})`);
      } else {
        console.log(`Added task: "${taskText}"${priorityInfo}`);
      }
      break;
      
    case 'done':
      const taskId = argv.id;
      const tasksAfterDone = markTaskDone(tasks, taskId);
      saveTasks(tasksAfterDone);
      console.log(`Marked task ${taskId} as done`);
      break;
      
    case 'remove':
      const removeId = argv.id;
      const tasksAfterRemove = removeTask(tasks, removeId);
      saveTasks(tasksAfterRemove);
      console.log(`Removed task ${removeId}`);
      break;
      
    case 'list':
      if (tasks.length === 0) {
        console.log('No tasks found.');
      } else {
        console.log('\nTasks:');
        // Show high priority tasks first, then by id
        const tasksForDisplay = [...tasks].sort((a, b) => {
          const aPriority = a.priority === 'high' ? 1 : 0;
          const bPriority = b.priority === 'high' ? 1 : 0;
          if (aPriority !== bPriority) return bPriority - aPriority;
          return a.id - b.id;
        });
        tasksForDisplay.forEach((task, index) => {
          const status = task.done ? '✓' : '○';
          const dueInfo = task.dueDate ? ` (due: ${task.dueDate.toLocaleDateString()})` : '';
          const priorityInfo = task.priority === 'high' ? ' [HIGH]' : '';
          console.log(`${index + 1}. ${status} ${task.text}${priorityInfo}${dueInfo}`);
        });
      }
      break;
      
    default:
      console.error('Error: Unknown command. Use --help for usage information.');
      process.exit(1);
  }
}

// Run CLI if this file is executed directly (not when imported by tests)
if (import.meta.url === `file://${process.argv[1]}` || 
    (import.meta.url.endsWith('todo-core.js') && process.argv[1] && process.argv[1].endsWith('todo-core.js'))) {
  main();
}