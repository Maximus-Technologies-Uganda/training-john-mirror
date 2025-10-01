# Changelog

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
