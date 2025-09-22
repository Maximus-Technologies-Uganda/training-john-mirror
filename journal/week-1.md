# Week 1 Journal

## Overview
This is the first week of the training program. This journal will track progress, learnings, and reflections.

## Goals for Week 1
- [ ] Set up development environment
- [ ] Complete initial project setup
- [ ] Review project requirements
- [ ] Begin learning objectives

## Daily Entries

### Day 0: Pre-flight & Repository Setup
**Timestamp:** Thursday, September 18, 2025

**Summary:**
This was the foundational day focused on setting up the entire repository with professional guardrails. The main goal was to prepare the project for the week's development work, mimicking a real-world company environment. This proved to be the most challenging day, involving a lot of configuration and debugging.

**What I accomplished:**
- **Repository Creation:** Created two repositories under the Maximus-Technologies-Uganda organization:
  - `training-john`: A private repository for all development work
  - `training-john-mirror`: A public repository to act as a portfolio, showing only clean, merged code
- **Default Branch:** Created the development branch and set it as the default for the private repository (best practice to protect the main branch)
- **Repository Labels:** Added four custom labels to help organize pull requests: `needs-review-packet`, `Training`, `Review`, and `Blocked`
- **CI Workflow Placeholders:** Created the initial YAML files for three GitHub Actions workflows: `quality-gate.yml`, `review-packet.yml`, and `mirror.yml`
- **Automated Mirror Sync:** Set up automated synchronization between private and public repositories
  - Generated SSH key pair on local machine using Git Bash
  - Added public key as "Deploy Key" with write access to the training-john-mirror repo
  - Added private key as "Action Secret" named DEPLOY_KEY to the training-john repo
  - Created the mirror.yml workflow to perform the sync

**What I learned:**
- Working locally with Git commands is often more reliable than the GitHub web UI for complex configurations
- SSH key management for automated deployments requires careful setup of both public and private keys
- Repository mirroring workflows can be complex and may require debugging through multiple iterations
- Professional development environments require proper branch protection and workflow automation

**Challenges faced:**
- **Mirror Sync Workflow Failures:** The mirror sync workflow failed repeatedly, requiring extensive debugging
- **GitHub Web UI Limitations:** Discovered that the workflow file content wasn't saving correctly through the GitHub web UI
- **SSH Key Configuration:** Required multiple attempts to properly configure SSH keys for automated deployment

**Solutions Applied:**
- Cloned the repository to local machine and fixed the workflow file in a code editor
- Pushed changes using Git commands instead of relying on web UI
- Learned manual push to mirror as a temporary workaround during debugging

**Evidence:**
- Commit for adding initial workflow files: [link-to-commit-95d4bbc]
- The final, working mirror.yml file: [link-to-mirror.yml]

**Tomorrow's focus:**
- Begin actual development work with the properly configured repository
- Test the automated mirror sync to ensure it's working correctly
- Start on the first development tasks

### Day 1: Bootstrap Repository Setup
**Date:** 12th September, 2025  
**Project:** training-john  
**Today's Goal:** Bootstrap the repository with initial project files (package.json, hello.js, etc) and merge them into the development branch via a pull request.

**What I accomplished:**
- **Branch Creation:** Created a new branch `chore/bootstrap` for the initial setup using `git switch -c chore/bootstrap`
- **Project Files Setup:** Added five essential files to bootstrap the Node.js project:
  - `package.json` for project metadata and scripts
  - `.gitignore` to exclude unnecessary files from version control
  - `README.md` for project documentation
  - `hello.js` as the main application file
  - `hello.test.js` for unit testing
- **Git Workflow:** Committed the new files and opened a pull request to merge them into the development branch
- **Version Control:** Successfully pushed changes to the remote repository after resolving sync issues

**What I learned:**
- **Project Initialization:** Understood that a standard Node.js project begins with files like `package.json` for metadata and scripts, and `.gitignore` to exclude unnecessary files
- **Basic Unit Testing:** Learned how to create a simple, separate test file to automatically verify that the main application code works as expected
- **Git Workflow:** Practiced the full feature branch workflow: creating a branch, committing work, and opening a pull request for review and merging
- **Git Synchronization:** Learned how to resolve conflicts when local and remote branches are out of sync using `git pull --rebase`

**Challenges faced:**
- **Git Push Rejection:** My first `git push` attempt was rejected because my local branch was out of sync with the remote repository
- **Branch Synchronization:** Had to learn how to handle situations where the remote repository had changes that weren't reflected in my local branch

**Solutions Applied:**
- **Git Rebase:** Used `git pull --rebase` to download the remote changes and reapply my local commits on top, which fixed the sync issue and allowed me to push successfully
- **Proper Git Commands:** Applied the correct sequence: `git switch -c chore/bootstrap`, `git add .`, `git commit -m "..."`, and `git push`

**Commands Used:**
- `git switch -c chore/bootstrap` - Created and switched to new branch
- `git add .` - Staged all new files
- `git commit -m "..."` - Committed changes with descriptive message
- `git push` - Pushed to remote repository
- `git pull --rebase` - Synchronized with remote changes

**Reflection:**
Today was a good start, focusing on setting up the project structure correctly. Creating all the initial files and a simple test made the project feel real. The push error was a good learning experience, as it taught me how to resolve conflicts when the local and remote branches are out of sync. This foundational work sets up the project for future development tasks.

**Tomorrow's focus:**
- Review and merge the pull request for the bootstrap files
- Begin working on the next development task
- Continue practicing the feature branch workflow

### Day 2: Dev Environment Setup & First CLI
**Date:** Tuesday 9th September, 2025  
**Project:** Week 1 - Dev Environment Setup & First CLI  
**Today's Goal:** Create .gitignore with AI, add README.md, modify Hello World and Git branching

**What I accomplished:**
- **File Creation with AI:** Created `.gitignore` and `README.md` files using AI assistance and pushed them to GitHub
- **CLI Enhancement:** Modified `hello.js` to accept a name as an argument and a `--shout` flag for enhanced functionality
- **Git Branching Workflow:** Created a new branch, added a default "World" greeting, and merged it back into main using a Pull Request
- **Authentication Setup:** Successfully configured GitHub Personal Access Token (PAT) for secure repository access

**What I learned:**
- **`.gitignore`:** Learned that it tells Git to ignore files like node_modules and other unnecessary files from version control
- **`process.argv`:** Discovered that this Node.js variable holds command-line arguments as an array, enabling CLI functionality
- **Git Branching:** Understood how to create a new branch with `git checkout -b` to work on changes safely without affecting the main branch
- **Pull Request (PR):** Learned that PRs are a way to propose and review changes before merging them into the main branch
- **GitHub Authentication:** Gained experience with Personal Access Tokens and their required scopes for repository access

**Challenges faced:**
- **Git Push Authentication Failure:** Git push failed due to authentication issues with GitHub
- **Branch Creation Error:** Encountered "fatal: a branch named x already exists" error when trying to create a branch that already existed
- **Repository Access Issues:** Faced "Repository not found" errors when pushing, related to authentication problems

**Solutions Applied:**
- **Personal Access Token:** Created a GitHub PAT with the repo scope and used it as the password for command line authentication
- **Branch Management:** Used `git checkout 'branch name'` (without -b) to switch to existing branches instead of trying to create them again
- **Authentication Configuration:** Properly configured Git credentials using the PAT for secure repository access

**Prompts That Helped Most:**
1. "How do I use a super prompt to create a file in Cursor?"
2. "What does 'fatal: The current branch main has no upstream branch' mean?"
3. "What scopes do I need for a GitHub Personal Access Token?"
4. "Why am I getting 'Repository not found' when I push?"

**Commands and Workflow:**
- Created `.gitignore` and `README.md` files with AI assistance
- Modified `hello.js` to accept command-line arguments and flags
- Used `git checkout -b` for new branch creation
- Used `git checkout 'branch name'` for switching to existing branches
- Created and merged Pull Request for code review workflow

**Reflection:**
Today felt like a big step up from just setting things up. Getting stuck on the GitHub authentication was frustrating, but solving it by creating a Personal Access Token felt like a real developer task. The branching workflow makes a lot of sense, and I can see why it's so important for working on features safely.

**Tomorrow's focus:**
- Continue building on the CLI functionality
- Practice more advanced Git workflows
- Explore additional Node.js command-line features

### Day 3: Stopwatch CLI & State Persistence
**Timestamp:** Friday, September 19, 2025

**Summary:**
The goal for Day 3 was to build a Stopwatch CLI. This project was more complex than the "Hello, World!" app because it required managing state (e.g., remembering the start time across different commands like lap and stop).

I successfully built the core logic for the stopwatch. More importantly, I took the initiative to add a more advanced feature: state persistence. Instead of just storing the start time in a variable that would be lost when the program ended, I taught myself how to use Node.js's fs (File System) module to save the start time to a starttime.json file. This made the stopwatch much more robust and useful.

This was a big step because I learned how to make my programs save and read data, which is a fundamental skill for building real applications.

**What I accomplished:**
- **Stopwatch CLI Development:** Built a complete stopwatch command-line application with core functionality
- **State Management:** Implemented proper state management to remember start time across different commands (lap, stop)
- **File System Integration:** Added advanced state persistence using Node.js fs (File System) module
- **JSON Data Handling:** Learned to save start time to `starttime.json` file for persistent storage
- **Advanced Feature Implementation:** Took initiative to add state persistence beyond basic requirements
- **Robust Application Design:** Created a more useful and practical stopwatch that maintains state between sessions

**What I learned:**
- **File System Operations:** Learned how to work with Node.js fs module for reading and writing files
- **JSON Data Format:** Mastered JSON.stringify (to save) and JSON.parse (to read) for data serialization
- **State Persistence:** Understood how to make programs save and read data, a fundamental skill for real applications
- **Server-side Logic:** Gained introduction to server-side programming concepts and data management
- **Advanced CLI Development:** Progressed from simple CLI apps to more complex stateful applications
- **Data Storage Patterns:** Learned common patterns for persisting application state between sessions

**Challenges faced:**
- **State Management Complexity:** Managing state across different commands (lap, stop) was more complex than previous simple apps
- **File System Learning Curve:** Learning how to work with the file system and handle data in JSON format
- **Data Serialization:** Understanding how to properly save and read data using JSON.stringify and JSON.parse
- **Application Architecture:** Designing a robust application that maintains state between program executions

**Solutions Applied:**
- **File System Module:** Used Node.js fs module to implement persistent data storage
- **JSON File Storage:** Created `starttime.json` file to store application state
- **Proper Data Handling:** Implemented JSON.stringify for saving and JSON.parse for reading data
- **State Persistence Design:** Built a system that maintains stopwatch state across different command executions

**Technical Implementation:**
- Built core stopwatch logic with start, lap, and stop functionality
- Implemented state persistence using `fs.writeFileSync()` and `fs.readFileSync()`
- Used JSON format for data storage in `starttime.json` file
- Created robust error handling for file operations

**Evidence:**
- Pull Request for Stopwatch Refactor: [link-to-pr]
- The stopwatch.js file with fs implementation: [link-to-stopwatch.js]

**Reflection:**
This was a significant step up in complexity from the "Hello, World!" application. Learning how to work with the file system and implement state persistence felt like a real breakthrough in understanding how applications work. The ability to save and read data is fundamental to building real applications, and this project gave me hands-on experience with these core concepts.

**Tomorrow's focus:**
- Continue building on state persistence concepts
- Explore more advanced file system operations
- Consider adding more features to the stopwatch CLI

### Day 4: Temperature Converter & Test-Driven Development (TDD)
**Timestamp:** Monday, September 22, 2025

**Summary:**
Today's project was to build a Temperature Converter CLI. The main goal was to create a tool that could convert values between Celsius and Fahrenheit and to practice a new workflow: Test-Driven Development (TDD).

Instead of writing the application code first, I started by writing a test file (temp-converter.test.js). I created a simple test case for converting 0°C to 32°F and ran it, watching it fail as expected (the "Red" phase). Then, I wrote the minimal amount of code in temp-converter.js required to make that test pass (the "Green" phase). We repeated this cycle to add the Fahrenheit-to-Celsius functionality.

The TDD approach was a new way of thinking. It felt backward at first, but I quickly saw the benefit. It forces you to think clearly about what your code needs to do before you write it, and it gives you immediate confidence that your logic is correct. It was also a good exercise in making my code modular by exporting functions from one file (temp-converter.js) and importing them into another (temp-converter.test.js).

**What I accomplished:**
- **Temperature Converter CLI:** Built a complete temperature conversion tool that converts between Celsius and Fahrenheit
- **Test-Driven Development:** Practiced TDD workflow by writing tests first, then implementing code
- **Red-Green Cycle:** Successfully implemented the TDD cycle: Red (failing test) → Green (passing test) → Refactor
- **Modular Code Design:** Created separate files for implementation (temp-converter.js) and testing (temp-converter.test.js)
- **Function Export/Import:** Learned to export functions from one file and import them into another for testing
- **Bidirectional Conversion:** Implemented both Celsius-to-Fahrenheit and Fahrenheit-to-Celsius conversion functionality

**What I learned:**
- **Test-Driven Development (TDD):** Understood the TDD workflow: write failing test first, then write minimal code to pass
- **Red-Green-Refactor Cycle:** Learned the three phases of TDD: Red (failing test), Green (passing test), Refactor (improve code)
- **Modular Programming:** Gained experience with exporting and importing functions between files
- **Test-First Thinking:** Learned to think about what code should do before writing it, leading to clearer requirements
- **Immediate Feedback:** Discovered how TDD provides instant confidence that logic is correct
- **Code Organization:** Understood the importance of separating implementation from testing code

**Challenges faced:**
- **Backward Thinking:** The TDD approach felt counterintuitive at first - writing tests before code seemed backward
- **Workflow Adjustment:** Had to adapt to a new development workflow that was different from previous approaches
- **Test Writing:** Learning to write effective test cases that properly validate the expected behavior
- **Code Modularity:** Understanding how to structure code for testing by exporting functions

**Solutions Applied:**
- **TDD Workflow Adoption:** Embraced the Red-Green cycle: wrote failing test, then minimal code to pass
- **Modular Design:** Created separate files for implementation and testing with proper export/import
- **Iterative Development:** Repeated the TDD cycle for each new feature (Celsius-to-Fahrenheit, then Fahrenheit-to-Celsius)
- **Clear Requirements:** Used test cases to define exactly what the code should do before implementation

**TDD Process Followed:**
1. **Red Phase:** Wrote test for converting 0°C to 32°F, watched it fail
2. **Green Phase:** Wrote minimal code in temp-converter.js to make test pass
3. **Refactor Phase:** Improved code while keeping tests passing
4. **Repeat:** Applied same cycle for Fahrenheit-to-Celsius functionality

**Technical Implementation:**
- Created `temp-converter.test.js` with test cases for temperature conversion
- Built `temp-converter.js` with conversion functions
- Used proper export/import syntax for modular code
- Implemented bidirectional temperature conversion logic

**Evidence:**
- Pull Request for the Temperature Converter: [link-to-pr]
- The final temp-converter.js and temp-converter.test.js files: [link-to-code-files]

**Reflection:**
The TDD approach was a significant shift in how I think about writing code. At first, it felt unnatural to write tests before implementation, but I quickly realized the benefits. It forces you to think clearly about requirements and gives you immediate confidence that your code works correctly. The modular approach of separating implementation from testing also made the code more organized and maintainable.

**Tomorrow's focus:**
- Continue practicing TDD workflow with more complex features
- Explore additional testing patterns and best practices
- Consider adding more temperature conversion features using TDD

### Day 5: Consolidation & Capstone PR
**Timestamp:** Friday, September 19, 2025

**Summary:**
Day 5 was focused on bringing all the work from the week together into a final Capstone Pull Request. The goal was to consolidate my projects, improve the overall documentation, and demonstrate a key piece of CI/CD automation.

I started by creating a new branch (chore/week1-wrap) for this final task. The main focus was creating a high-quality, professional README.md file for the project's root directory. I wrote a clear summary of the project and added detailed "Usage" examples for each of the CLIs I had built.

The most important part of the day was learning how to trigger a specific workflow based on a label. After creating the Capstone PR, I applied the needs-review-packet label. This successfully triggered the special "Review Packet" workflow, which was the final objective for the week.

This was a great lesson in the power of GitHub Actions. Learning that you can control which workflows run based on labels is a powerful concept for managing complex projects. It felt great to see all the different pieces of the puzzle—branching, coding, documentation, and CI/CD—come together in one final, successful merge.

**What I accomplished:**
- **Week Consolidation:** Brought together all the work from the week into a final Capstone Pull Request
- **Professional Documentation:** Created a high-quality, comprehensive README.md file for the project root directory
- **Usage Examples:** Added detailed usage examples for each CLI tool built during the week
- **Branch Management:** Created `chore/week1-wrap` branch for the final consolidation task
- **CI/CD Automation:** Successfully triggered the "Review Packet" workflow using label-based automation
- **Label-Based Workflow:** Applied the `needs-review-packet` label to trigger specific GitHub Actions workflow
- **Project Integration:** Demonstrated how all components (branching, coding, documentation, CI/CD) work together

**What I learned:**
- **GitHub Actions Power:** Discovered how to control which workflows run based on labels, a powerful concept for complex projects
- **Label-Based Automation:** Learned that labels can trigger specific workflows, enabling sophisticated CI/CD pipelines
- **Professional Documentation:** Understood the importance of comprehensive README files with clear usage examples
- **Project Consolidation:** Gained experience in bringing together multiple components into a cohesive final deliverable
- **CI/CD Integration:** Saw how different pieces (branching, coding, documentation, automation) integrate into a complete workflow
- **Workflow Management:** Learned to use labels as triggers for different types of automated processes

**Challenges faced:**
- **Project Integration:** Bringing together multiple separate projects into one cohesive final deliverable
- **Documentation Quality:** Creating professional-grade documentation that clearly explains all the CLI tools
- **Workflow Understanding:** Learning how label-based workflow triggers work in GitHub Actions
- **Final Consolidation:** Ensuring all components work together properly in the final merge

**Solutions Applied:**
- **Structured Approach:** Created dedicated branch (`chore/week1-wrap`) for final consolidation work
- **Comprehensive Documentation:** Wrote detailed README with clear project summary and usage examples
- **Label-Based Triggering:** Applied `needs-review-packet` label to trigger the Review Packet workflow
- **Systematic Integration:** Methodically brought together all week's work into final Capstone PR

**Technical Implementation:**
- Created `chore/week1-wrap` branch for final consolidation
- Enhanced root README.md with professional documentation and usage examples
- Applied `needs-review-packet` label to trigger specific GitHub Actions workflow
- Successfully demonstrated label-based CI/CD automation

**CI/CD Workflow Demonstrated:**
- **Label Trigger:** Applied `needs-review-packet` label to PR
- **Automated Response:** GitHub Actions detected label and triggered Review Packet workflow
- **Workflow Execution:** Successfully ran the special workflow designed for review processes
- **Integration Success:** Demonstrated how labels control workflow execution in complex projects

**Evidence:**
- Capstone Pull Request (#12): [link-to-pr-12]
- Successful Review Packet workflow run: [link-to-ci-run]

**Reflection:**
This was an excellent culmination of the week's learning. Seeing all the different pieces—branching, coding, documentation, and CI/CD automation—come together in one final, successful merge was incredibly satisfying. Learning about label-based workflow triggers opened my eyes to the power of GitHub Actions for managing complex projects. The ability to control which workflows run based on labels is a sophisticated concept that will be valuable for larger projects.

**Tomorrow's focus:**
- Begin Week 2 with new learning objectives
- Apply the CI/CD and documentation practices learned this week
- Continue building on the foundation established in Week 1

## Week 1 Summary
**Key Achievements:**
- 

**Major Learnings:**
- 

**Areas for Improvement:**
- 

**Goals for Next Week:**
- 

## Notes and Resources
- 

## Questions and Next Steps
- 
