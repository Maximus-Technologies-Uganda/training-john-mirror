import path from 'path';
import { addTask, markTaskDone } from './src/todo-core.js';
import { loadData, saveData } from './src/storage.js';

const todoFilePath = path.join(process.cwd(), 'data', 'todos.json');
const [command, ...args] = process.argv.slice(2);

let tasks = loadData(todoFilePath);

switch (command) {
  case 'add':
    const taskName = args.join(' ');
    tasks = addTask(tasks, taskName);
    saveData(tasks, todoFilePath);
    console.log(`Added task: "${taskName}"`);
    break;

  case 'list':
    console.log('--- TODO LIST ---');
    tasks.forEach((task, index) => {
      if (typeof task === 'string') {
        // Handle old string format
        console.log(`[ ] ${index + 1}: ${task}`);
      } else {
        // Handle new object format
        console.log(`[${task.done ? 'x' : ' '}] ${task.id}: ${task.text}`);
      }
    });
    break;

  case 'done':
    const taskId = parseInt(args[0], 10);
    if (taskId <= tasks.length) {
      // Handle old string format - convert to new format
      const taskText = typeof tasks[taskId - 1] === 'string' ? tasks[taskId - 1] : tasks[taskId - 1].text;
      const newTask = {
        id: taskId,
        text: taskText,
        done: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      tasks[taskId - 1] = newTask;
      saveData(tasks, todoFilePath);
      console.log(`Marked task ${taskId} as done.`);
    } else {
      tasks = markTaskDone(tasks, taskId);
      saveData(tasks, todoFilePath);
      console.log(`Marked task ${taskId} as done.`);
    }
    break;

  default:
    console.log('Usage: node todo-cli.js <add|list|done> [arguments]');
    break;
}