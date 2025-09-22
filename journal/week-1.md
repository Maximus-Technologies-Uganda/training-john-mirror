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

### Day 3 - [Date]
**What I accomplished:**
- 

**What I learned:**
- 

**Challenges faced:**
- 

**Tomorrow's focus:**
- 

### Day 4 - [Date]
**What I accomplished:**
- 

**What I learned:**
- 

**Challenges faced:**
- 

**Tomorrow's focus:**
- 

### Day 5 - [Date]
**What I accomplished:**
- 

**What I learned:**
- 

**Challenges faced:**
- 

**Tomorrow's focus:**
- 

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
