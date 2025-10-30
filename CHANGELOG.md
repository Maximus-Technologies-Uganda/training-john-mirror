# Changelog
## Week 2

- **Features**
  - `feature/LIN-QUO-quote-core-and-tests` – Introduced the quote domain core module with comprehensive test coverage.
  - `feature/LIN-EXP-expense-tests` – Expanded expense suite to assert happy-path and edge case behaviour.
  - `feature/LIN-TODO-todo-tests` – Strengthened todo workflow tests for higher reliability.
  - `feature/LIN-SW-stopwatch-exporter+golden` – Added stopwatch exporter plus golden snapshots to lock output format.
- **Fixes**
  - `feature/LIN-DOC-harden-temp-converter` – Hardened the temperature converter to handle invalid input and clarified its usage.
- **Internal Chores**
  - `chore/LIN-DOC-repo-hygiene` – Curated documentation and repo hygiene items to keep the workspace tidy.
  - `chore/LIN-DOC-coverage-uplift` – Tuned coverage tooling and reports to surface gaps and track improvements.

## [Week 2] - 2025-10-03
### Added
- Initial scaffolding for the `quote` CLI, including core logic, CLI wrapper, and a full test suite.
- Table-driven tests and robust input validation for the `temp-converter` CLI.
- Golden file tests for the `stopwatch` CLI after refactoring the output exporter.
- New features for the `todo` CLI, including `--due Today`, `--highPriority`, and a duplicate guard, with corresponding tests.

### Changed
- Significantly increased test coverage for the `expense` CLI to >90% by testing all error paths.
- Improved error messages and output formatting across all applications as part of capstone improvements.
- Ensured all application `README.md` files are accurate and match real command outputs.

### Project
- Configured CI Quality Gate to collect and report test coverage for all applications on pull requests.
- Added a `.gitattributes` file for consistent line endings across the repository.
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive table-driven tests for temperature converter validation
- Golden file tests for stopwatch data formatting
- Repository hygiene improvements with .gitattributes for consistent line endings
- Enhanced Quality Gate workflow with coverage percentage table posting
- Pure function architecture for temperature converter with thin CLI wrapper

### Changed
- Refactored temperature converter to use pure functions (celsiusToFahrenheit, fahrenheitToCelsius)
- Enhanced temperature converter validation with comprehensive error handling
- Updated Jest configurations across all apps for proper coverage collection
- Improved error messages and validation in temperature converter
- Enhanced README documentation for temperature converter with accurate examples

### Fixed
- Line ending consistency issues that were causing golden file test failures
- Jest configuration issues for ES modules in individual apps
- Coverage reporting configuration across all applications
- Temperature converter CLI detection logic for more robust execution

### Security

- Added comprehensive input validation to prevent invalid temperature conversions
- Implemented proper error handling with non-zero exit codes for all validation failures

## [2024-12-18] - Week 1 Capstone

### Added
- Initial CLI applications: hello, jokes, expenses, todo, stopwatch, temp-converter
- Basic test coverage for all applications
- GitHub Actions workflows for CI/CD
- Branch protection rules and quality gates

### Changed
- Standardized project structure across all CLI applications
- Implemented consistent error handling patterns

### Fixed
- Initial setup and configuration issues
- Test environment setup for all applications
