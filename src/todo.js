const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;
const command = argv._[0]; // Gets the command, e.g., 'add' or 'list'
const task = argv._[1]; // Gets the argument, e.g., the task text
const dbPath = './todos.json'; // The path to our data file

function listTasks() {
  const todos = JSON.parse(fs.readFileSync(dbPath));
  console.log('--- Your Todos ---');
  todos.forEach((todo, index) => {
    console.log(`${index + 1}. ${todo}`);
  });
  console.log('------------------');
}

function addTask(newTask) {
  const todos = JSON.parse(fs.readFileSync(dbPath));
  todos.push(newTask);
  fs.writeFileSync(dbPath, JSON.stringify(todos, null, 2));
  console.log(`Added new task: "${newTask}"`);
  listTasks();
}

// Main logic to decide which function to run
if (command === 'list') {
  listTasks();
} else if (command === 'add' && task) {
  addTask(task);
} else {
  console.log("Welcome to Todo CLI. Available commands: list, add '<task>'");
}