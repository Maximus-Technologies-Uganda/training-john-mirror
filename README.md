# Week 1 CLI Tools Collection
## Test Coverage

This project collects test coverage for all applications during the CI run. [cite_start]To view the detailed HTML coverage reports, please look for the **`review-packet`** artifact in the latest GitHub Actions run for your pull request. [cite: 58]

[cite_start]Inside the unzipped artifact, open the `review-artifacts/index.html` file to view the main **Coverage Index**. [cite: 58, 70] [cite_start]This index provides links to the detailed report for each application. [cite: 58]

---

## 📋 How to Review UI

This section provides reviewers with everything needed to verify the quality and completeness of the UI applications built during this training.

### 🚀 Quick Start: View Coverage & Playwright Tests

**3-Step Process:**

1. **Download Review Packet artifact** from the GitHub Actions run
   - Look for: `review-packet-*` artifact in the workflow summary

2. **Open Coverage Index** in your browser
   - Navigate to: `review-artifacts/index.html`
   - This shows overall coverage and links to detailed reports

3. **View Playwright E2E Test Reports**
   - Scroll to: **Playwright E2E Tests** section in the Coverage Index
   - Click: **[View Report]** link for each app
   - See: Videos, screenshots, traces, and test results

**That's it!** All coverage metrics and test artifacts are available from the main Coverage Index page.

---

### 📦 Review Artifacts Location

All review artifacts are available in the **Review Packet** artifact from the latest GitHub Actions run:

1. **Go to the Pull Request** → Click on **"Checks"** tab
2. **Find the "quality-checks" job** → Click **"Summary"**
3. **Download the "junit-results" or "coverage-reports" artifact**
4. **Unzip** and open the contained files

### 📊 Coverage Index

**Primary artifact**: `review-artifacts/index.html`

This is your main entry point for coverage review. It displays:
- **Overall coverage**: 86.42% statements (1955/2262)
- **Coverage by component**: Individual coverage reports for each UI app
- **Detailed breakdowns**: Statements, branches, functions, and lines covered

**To view coverage:**
1. Download and unzip the review-packet artifact
2. Open `review-artifacts/index.html` in your web browser
3. Click on individual app links to see detailed coverage

**Per-App Coverage Paths:**
- **Expense UI**: `review-artifacts/ui-coverage-expense/index.html` | LCOV: `review-artifacts/coverage-expense/lcov-report/index.html`
- **Stopwatch UI**: `review-artifacts/ui-coverage-stopwatch/index.html` | LCOV: `review-artifacts/coverage-stopwatch/lcov-report/index.html`
- **Temp Converter UI**: `review-artifacts/ui-coverage-temp/index.html` | LCOV: `review-artifacts/coverage-temp/lcov-report/index.html`
- **To-Do UI**: `review-artifacts/ui-coverage-todo/index.html` | LCOV: `review-artifacts/coverage-todo/lcov-report/index.html`

### 🧪 Individual UI Application Coverage

Each UI app has dedicated coverage tracking at minimum targets:

| App | Location | Target | Status |
|-----|----------|--------|--------|
| **To-Do UI** | `review-artifacts/coverage/apps/todo/ui/` | ≥60% | ✅ 94.43% |
| **Expense UI** | `review-artifacts/coverage/expenses/src/` | ≥60% | ✅ 81.3% |
| **Stopwatch UI** | `apps/stopwatch/ui/coverage/` | ≥50% | ✅ Ready |
| **Temp Converter UI** | `apps/temp/ui/coverage/` | ≥50% | ✅ Ready |

### 🎬 Playwright Test Artifacts

**E2E test traces and videos**: `review-artifacts/playwright/*/`

Includes:
- Browser traces (`.trace` files) for debugging test execution
- Screenshots of key test steps
- Videos of full test runs (if configured)
- Detailed test reports with links to view each trace

**To review E2E tests:**
1. Download and unzip the **Review Packet** artifact
2. Open `review-artifacts/index.html` → **Coverage Index**
3. Scroll to **Playwright E2E Tests** section
4. Click the **[View Report]** link for each app (expense, stopwatch, temp)
5. This opens the **Playwright trace report** showing:
   - ✅ Test results and pass/fail status
   - 🎥 Video recordings of test execution
   - 📸 Screenshots at test failure points
   - 🔍 Detailed trace information for debugging
6. Review test execution videos and screenshots
7. Check for any failed assertions or errors

**Playwright Artifact Locations:**
- **Traces/Screenshots/Videos**: `review-artifacts/playwright/<app>/` (contains all test artifacts)
  - **Expense reports**: `review-artifacts/playwright/expense/index.html`
  - **Stopwatch reports**: `review-artifacts/playwright/stopwatch/index.html`
  - **Temp Converter reports**: `review-artifacts/playwright/temp/index.html`
- **What's included in each app's directory**:
  - 📋 `index.html` - Main Playwright HTML report with test results
  - 🎥 `data/` - Videos of test execution (on failure)
  - 📸 `.png` files - Screenshots captured during test failures
  - 🔍 `.trace` files - Browser traces for detailed debugging
  - `.md` files - Error context and step-by-step test details

### 📝 Review Packet Summary

**Main review file**: `_review/summary.md`

Contains:
- PR metadata (author, base branch, labels)
- List of all changed files with impact analysis
- Risk assessment (workflow changes, dependency updates, large diffs)
- Commit history with authorship
- Links to all generated artifacts

### ✅ Quality Gate Verification

**Test Results**: `review-artifacts/test-results/junit.xml`

The Quality Gate job verifies:
1. ✅ **Unit tests pass**: All component and hook tests
2. ✅ **Lint checks pass**: ESLint rules are satisfied
3. ✅ **Coverage meets targets**: UI apps exceed minimum thresholds
4. ✅ **Test results exported**: JUnit XML for CI dashboards

### 🔍 Recommended Review Checklist

When reviewing a UI-focused PR:

- [ ] **Coverage Index**: Is overall coverage ≥86%? Are all UI apps at or above minimum?
- [ ] **Component Tests**: Open `review-artifacts/` and verify all test files
- [ ] **E2E Tests**: Check Playwright traces for visual regressions
- [ ] **Changed Files**: Review changed test files for adequate coverage
- [ ] **Edge Cases**: Verify error handling, accessibility, and keyboard nav tests exist
- [ ] **Performance**: Check for virtual scrolling, memoization in large lists
- [ ] **Accessibility**: Verify ARIA labels, keyboard navigation, focus management
- [ ] **Review Packet**: Read `_review/summary.md` for change summary and risk areas

### 🚀 Running Tests Locally

To reproduce test results locally:

```bash
# Install dependencies
npm install

# Run all tests with coverage
npm run test:ci

# Run specific UI app tests
cd apps/todo/ui
npm test -- --run --coverage

# Run E2E tests
npx playwright test
```

### 📖 Documentation References

- **To-Do UI README**: `apps/todo/ui/README.md` - Development guide and testing strategy
- **Expense UI README**: `apps/expense/ui/README.md` - Development guide and testing strategy
- **Stopwatch UI README**: `apps/stopwatch/ui/README.md` - Development guide and testing strategy
- **Temp Converter UI README**: `apps/temp/ui/README.md` - Development guide and testing strategy
- **Accessibility Audit**: `ACCESSIBILITY_AUDIT.md` - WCAG compliance details
- **Test Coverage Report**: `TEST_COVERAGE_REPORT.md` - Detailed coverage analysis

---

## 📁 Data Directory Structure

Runtime data files are organized under the `data/` directory to maintain a clean, professional project structure.

### Directory Layout

```
data/
├── time.json                    # Stopwatch state (do not commit)
├── persistence/
│   ├── todos.json              # Todo list items (do not commit)
│   ├── expenses.json           # Expense records (do not commit)
│   └── example.json            # Template file (tracked)
└── example.json                # Template file (tracked)
```

### Do Not Commit These Files

All `.json` files in the `data/` directory except templates are automatically ignored by `.gitignore`. Never manually commit:
- `data/time.json` - Contains active stopwatch state
- `data/persistence/todos.json` - Contains user tasks
- `data/persistence/expenses.json` - Contains user expenses

These files are runtime data and are specific to each user's environment.

### CLI Storage Configuration

All CLI tools support the `--storage` parameter to specify a custom data file path. This is essential for testing and CI/CD environments.

**Usage:**

```bash
# Use default path (data/persistence/expenses.json)
node expenses list

# Use custom path (useful for testing)
node expenses list --storage /tmp/test-expenses.json

# Use environment variable
export EXPENSES_DATA_FILE=/custom/path/expenses.json
node expenses list
```

**Storage Path Priority:**
1. **CLI `--storage` argument** - Highest priority (e.g., `--storage /tmp/test.json`)
2. **Environment variable** - `EXPENSES_DATA_FILE` or app-specific var
3. **Default path** - `data/persistence/<filename>.json`

This allows developers to easily configure storage paths for different environments (development, testing, CI/CD).

---

A comprehensive collection of command-line tools built during the first week of development training. This project demonstrates fundamental programming concepts, CLI development, file system operations, state management, and Test-Driven Development (TDD).

## Branch Protection & Mirroring Setup

This repository is configured with:
- **Default branch**: `development` (protected)
- **Branch protection**: Requires Quality Gate and Review Packet checks
- **Mirror repository**: [training-john-mirror](https://github.com/Maximus-Technologies-Uganda/training-john-mirror)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- No additional dependencies required

### UI Foundations
**For developing React UI applications in `apps/*/ui/` workspaces:**

- **Node.js**: v18+ (required for modern React tooling)
- **Playwright**: Browser automation for E2E testing (installed automatically with UI workspaces)
- **Modern browsers**: Chrome, Firefox, Safari for testing (Playwright handles this)

**UI workspaces are configured with:**
- Vite for fast development and building
- Vitest + React Testing Library for unit/component testing (≥60% coverage required)
- Playwright for E2E smoke testing
- ESLint with React rules
- Hot reload development server on port 3000

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
## Testing

This project uses Vitest for unit and integration testing.

### Running Tests

To run all tests, use the following command from the root directory:

```bash
npm test
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