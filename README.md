# My First CLI Tools

This project contains the command-line tools I built during my first week of learning development.

## Installation

No installation needed. Just make sure you have Node.js installed.

## Usage

### Hello Greeter (`hello.js`)

Greets the user. Can also shout the greeting.

-   **Default greeting:**
    ```bash
    node src/hello.js
    ```
-   **Greet by name:**
    ```bash
    node src/hello.js Preston
    ```
-   **Shout the greeting:**
    ```bash
    node src/hello.js Preston --shout
    ```

### Stopwatch (`stopwatch.js`)

A simple command-line stopwatch.

-   **Start the timer:**
    ```bash
    node src/stopwatch.js start
    ```
-   **Stop the timer:**
    ```bash
    node src/stopwatch.js stop
    ```

### Expense Tracker (`expense.js`)

A tool to track expenses.

-   **Add an expense:**
    ```bash
    node src/expense.js add 15.50 "Lunch with client"
    ```
-   **List all expenses:**
    ```bash
    node src/expense.js list
    ```
-   **Calculate total expenses:**
    ```bash
    node src/expense.js total
    ```

### To-Do List (`todo.js`)

A tool to manage a to-do list.

-   **Add a task:**
    ```bash
    node src/todo.js add "Buy groceries"
    ```
-   **List all tasks:**
    ```bash
    node src/todo.js list
    ```
-   **Mark a task as done (e.g., task #1):**
    ```bash
    node src/todo.js done 1
    ```
-   **Remove a task (e.g., task #1):**
    ```bash
    node src/todo.js remove 1
    ```