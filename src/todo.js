const fs = require('fs');
const path = require('path');
const todoFile = path.join(__dirname, '../data/todo.json');

// Helper function to read the to-do list
function getTodos() {
    if (fs.existsSync(todoFile)) {
        const content = fs.readFileSync(todoFile);
        return JSON.parse(content);
    }
    return [];
}

// Helper function to save the to-do list
function saveTodos(todos) {
    fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
}

// Main logic
const command = process.argv[2];
const argument = process.argv[3];
function calculateTotal(expenses) {
}
switch (command) {
    case 'add':
        if (!argument) {
            console.log('Error: Please provide a task to add.');
            break;
        }
        const todos = getTodos();
        todos.push({ task: argument, status: 'pending' });
        saveTodos(todos);
        console.log(`Added task: "${argument}"`);
        break;

    case 'list':
        const allTodos = getTodos();
        if (allTodos.length === 0) {
            console.log('Your to-do list is empty.');
        } else {
            console.log('To-Do List:');
            allTodos.forEach((item, index) => {
                const status = item.status === 'done' ? '[x]' : '[ ]';
                console.log(`${index + 1}. ${status} ${item.task}`);
            });
        }
        break;

    case 'done':
        const taskNumber = parseInt(argument, 10) - 1;
        let existingTodos = getTodos();
        if (existingTodos[taskNumber]) {
            existingTodos[taskNumber].status = 'done';
            saveTodos(existingTodos);
            console.log(`Marked task "${existingTodos[taskNumber].task}" as done.`);
        } else {
            console.log('Error: Invalid task number.');
        }
        break;

    case 'remove':
        const removeNumber = parseInt(argument, 10) - 1;
        let currentTodos = getTodos();
        if(currentTodos[removeNumber]) {
            const removed = currentTodos.splice(removeNumber, 1);
            saveTodos(currentTodos);
            console.log(`Removed task: "${removed[0].task}"`);
        } else {
            console.log('Error: Invalid task number.');
        }
        break;

    default:
        console.log('Unknown command. Available commands: add, list, done, remove');
        break;
}