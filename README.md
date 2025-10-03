# Week 1 CLI Tools Collection
## Test Coverage

This project collects test coverage for all applications during the CI run. [cite_start]To view the detailed HTML coverage reports, please look for the **`review-packet`** artifact in the latest GitHub Actions run for your pull request. [cite: 58]

[cite_start]Inside the unzipped artifact, open the `review-artifacts/index.html` file to view the main **Coverage Index**. [cite: 58, 70] [cite_start]This index provides links to the detailed report for each application. [cite: 58]
A comprehensive collection of command-line tools built during the first week of development training. This project demonstrates fundamental programming concepts, CLI development, file system operations, state management, and Test-Driven Development (TDD).

## Branch Protection & Mirroring Setup

This repository is configured with:
- **Default branch**: `development` (protected)
- **Branch protection**: Requires Quality Gate and Review Packet checks
- **Mirror repository**: [training-john-mirror](https://github.com/Maximus-Technologies-Uganda/training-john-mirror)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- No additional dependencies required

### Installation
```bash
# Clone the repository
git clone https://github.com/Maximus-Technologies-Uganda/training-john.git
cd training-john

# Install dependencies (if any)
npm install
```

## 📚 Available CLI Tools

### 1. Hello Greeter (`hello.js`)
A simple greeting tool that demonstrates command-line argument parsing and conditional logic.

**Features:**
- Default greeting with "World"
- Custom name greeting
- Shout mode for uppercase output

**Usage:**
```bash
# Default greeting
node src/hello.js
# Output: Hello, World!

# Greet by name
node src/hello.js Preston
# Output: Hello, Preston!

# Shout the greeting
node src/hello.js Preston --shout
# Output: HELLO, PRESTON!

# Show help
node src/hello.js --help
# Output: Usage information and examples

# Handle special characters
node src/hello.js "José María"
# Output: Hello, José María!
```

### 2. Stopwatch (`stopwatch.js`)
A comprehensive stopwatch with state persistence, demonstrating file system operations and JSON data handling.

**Features:**
- Start/stop functionality
- Lap time tracking
- Status checking
- State persistence across sessions
- Reset capability
- Formatted time display (hours, minutes, seconds)

**Usage:**
```bash
# Start the stopwatch
node src/stopwatch.js start
# Output: Stopwatch started at 20:43:35

# Check current status
node src/stopwatch.js status
# Output: Stopwatch is running. Elapsed time: 1m 23s

# Record a lap time
node src/stopwatch.js lap
# Output: Lap time: 1m 45s

# Stop the stopwatch
node src/stopwatch.js stop
# Output: Stopwatch stopped. Total elapsed time: 2m 15s

# Reset the stopwatch
node src/stopwatch.js reset
# Output: Stopwatch reset.

# Use custom storage location
node src/stopwatch.js start --storage /custom/path.json
# Output: Stopwatch started at 20:43:35

# Show help
node src/stopwatch.js --help
# Output: Usage information and options
```

### 3. Temperature Converter (`temp-converter.js`)
A robust temperature conversion tool built using Test-Driven Development (TDD) principles.

**Features:**
- Celsius to Fahrenheit conversion
- Fahrenheit to Celsius conversion
- Input validation and error handling
- Precision control (2 decimal places)
- Case-insensitive unit inputs
- Comprehensive error messages

**Usage:**
```bash
# Convert Celsius to Fahrenheit
node src/temp-converter.js --value 0 --from C --to F
# Output: 0°C = 32°F

# Convert Fahrenheit to Celsius
node src/temp-converter.js --value 32 --from F --to C
# Output: 32°F = 0°C

# Convert with decimals
node src/temp-converter.js --value 37.5 --from C --to F
# Output: 37.5°C = 99.5°F

# Case insensitive
node src/temp-converter.js --value 25 --from c --to f
# Output: 25°C = 77°F

# Show help
node src/temp-converter.js --help
# Output: Usage information and examples

# Error handling
node src/temp-converter.js --value -300 --from C --to F
# Output: Validation errors and usage information
```

### 4. Expense Tracker (`expense.js`)
A simple expense tracking tool demonstrating data persistence and CRUD operations.

**Features:**
- Add expenses with amounts and descriptions
- List all expenses
- Calculate total expenses
- JSON data persistence

**Usage:**
```bash
# Add an expense
node src/expense.js add 15.50 "Lunch with client"
# Output: Expense added: $15.50 - Lunch with client

# List all expenses
node src/expense.js list
# Output: 
# 1. $15.50 - Lunch with client
# 2. $25.00 - Coffee meeting

# Calculate total
node src/expense.js total
# Output: Total expenses: $40.50
```

### 5. To-Do List (`todo.js`)
A task management tool with basic CRUD operations and state persistence.

**Features:**
- Add tasks
- List all tasks
- Mark tasks as done
- Remove tasks
- JSON data persistence

**Usage:**
```bash
# Add a task
node src/todo.js add "Buy groceries"
# Output: Task added: Buy groceries

# List all tasks
node src/todo.js list
# Output:
# 1. [ ] Buy groceries
# 2. [✓] Complete project

# Mark task as done
node src/todo.js done 1
# Output: Task 1 marked as done

# Remove a task
node src/todo.js remove 1
# Output: Task 1 removed
```

### 6. Joke Generator (`jokes.js`)
An enhanced entertainment tool that fetches random jokes from an external API with comprehensive features.

**Features:**
- Random joke generation with category selection
- Multiple joke types (single-line and two-part jokes)
- Comprehensive error handling and validation
- Help system with usage examples
- Network error resilience
- Category and type listing

**Usage:**
```bash
# Get a random joke
node src/jokes.js
# Output: Fetching a twopart joke from the 'Any' category...
# ==================================================
# [Random joke content]
# ==================================================

# Get a programming joke
node src/jokes.js --category Programming
# Output: Fetching a twopart joke from the 'Programming' category...

# Get a single-line dark joke
node src/jokes.js --category Dark --type single
# Output: Fetching a single joke from the 'Dark' category...

# List available categories
node src/jokes.js --categories
# Output: Available joke categories:
#   - Any
#   - Programming
#   - Misc
#   - Dark
#   - Pun
#   - Spooky
#   - Christmas

# List available types
node src/jokes.js --types
# Output: Available joke types:
#   - single
#   - twopart

# Show help
node src/jokes.js --help
# Output: Usage information and examples

# Error handling with helpful suggestions
node src/jokes.js --category InvalidCategory
# Output: Error: Invalid category. Must be one of: Any, Programming, Misc, Dark, Pun, Spooky, Christmas
# Available categories:
#   - Any
#   - Programming
#   - Misc
#   - Dark
#   - Pun
#   - Spooky
#   - Christmas
```

### 7. Legacy Joke Generator (`jokes-cli.js`)
A simple backward-compatible joke generator for basic usage.

**Features:**
- Simple random joke generation
- Basic error handling
- Backward compatibility

**Usage:**
```bash
# Get a random joke (simple version)
node jokes-cli.js
# Output: [Random joke content]
```

## 🧪 Testing

This project includes comprehensive test suites demonstrating different testing approaches:

### Unit Tests
```bash
# Test hello.js functionality
node tests/hello.test.js

# Test stopwatch functionality
node tests/stopwatch.test.js

# Test temperature converter
node src/temp-converter.test.js
```

### TDD Demonstration
```bash
# Run TDD workflow demonstration
node tests/temp-converter-tdd-demo.js
```

## 📁 Project Structure

```
training-john/
├── src/                    # Source code
│   ├── hello.js           # Hello greeter CLI
│   ├── hello-core.js      # Hello core logic
│   ├── stopwatch.js       # Stopwatch with state persistence
│   ├── stopwatch-core.js  # Stopwatch core logic
│   ├── stopwatch-storage.js # Stopwatch storage abstraction
│   ├── temp-converter.js  # Temperature converter (TDD)
│   ├── temp-converter.test.js # Temperature converter tests
│   ├── expense.js         # Expense tracker
│   ├── todo.js            # To-do list manager
│   ├── todo.test.js       # To-do list tests
│   ├── joke.js            # Legacy joke generator
│   ├── jokes.js           # Enhanced joke generator CLI
│   └── jokes-core.js      # Jokes core logic
├── tests/                 # Test files
│   ├── hello.test.js      # Hello greeter tests
│   ├── stopwatch.test.js  # Stopwatch tests
│   ├── stopwatch-core.test.js # Stopwatch core tests
│   ├── jokes.test.js      # Jokes tests
│   └── temp-converter-tdd-demo.js # TDD demonstration
├── data/                  # Data persistence files
│   ├── time.json          # Stopwatch state
│   ├── expenses.json      # Expense data
│   └── todo.json          # To-do list data
├── journal/               # Learning journal
│   ├── week-1.md          # Week 1 development journal
│   └── tightening-week.md # Tightening week journal
├── .github/               # GitHub Actions workflows
│   └── workflows/
│       ├── quality-gate.yml
│       ├── review-packet.yml
│       └── repo-mirror.yml
├── jokes-cli.js          # Legacy jokes CLI
├── package.json           # Project configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🎯 Learning Objectives Achieved

### Day 1: Bootstrap Repository Setup
- ✅ Git workflow mastery (branching, committing, pull requests)
- ✅ Project initialization and file structure
- ✅ Basic Node.js project setup

### Day 2: Dev Environment Setup & First CLI
- ✅ Command-line argument parsing with yargs
- ✅ CLI development best practices
- ✅ Git authentication and repository management
- ✅ File system operations (.gitignore, README)

### Day 3: Stopwatch CLI & State Persistence
- ✅ Advanced file system operations
- ✅ JSON data serialization and persistence
- ✅ State management across program executions
- ✅ Error handling and robust application design

### Day 4: Temperature Converter & Test-Driven Development
- ✅ Test-Driven Development (TDD) workflow
- ✅ Red-Green-Refactor cycle implementation
- ✅ Modular programming with export/import
- ✅ Comprehensive testing strategies
- ✅ Input validation and error handling

### Day 5: Consolidation & Capstone PR
- ✅ Project integration and consolidation
- ✅ Professional documentation standards
- ✅ CI/CD workflow understanding
- ✅ Label-based automation triggers

## 🔧 Technical Skills Demonstrated

- **CLI Development**: Command-line interface design and implementation
- **File System Operations**: Reading, writing, and managing files
- **Data Persistence**: JSON serialization and state management
- **Error Handling**: Comprehensive error management and user feedback
- **Testing**: Unit testing, TDD, and test automation
- **Git Workflow**: Branching, merging, pull requests, and collaboration
- **CI/CD**: GitHub Actions, automated workflows, and deployment
- **Documentation**: Professional README and code documentation

## 🚀 CI/CD Automation

This project includes automated workflows:

- **Quality Gate**: Automated code quality checks
- **Review Packet**: Label-triggered review processes
- **Repository Mirror**: Automated synchronization between repositories

### Triggering Workflows
```bash
# Apply label to trigger review packet workflow
# (Done through GitHub web interface)
```

## 📖 Learning Journal

Detailed documentation of the learning process, challenges faced, and solutions implemented can be found in the [Week 1 Journal](journal/week-1.md).

## 🤝 Contributing

This is a learning project. For questions or suggestions, please refer to the learning journal or create an issue.

## 📄 License

This project is part of a development training program and is for educational purposes.

---
## Week 1 Capstone Complete
**Built with ❤️ during Week 1 of development training**

## 🧪 Review Packet Demo
This section was added to demonstrate the review packet workflow functionality. The review packet system will analyze this change and provide a comprehensive summary of the modifications.