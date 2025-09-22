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

### Day 1 - [Date]
**What I accomplished:**
- 

**What I learned:**
- 

**Challenges faced:**
- 

**Tomorrow's focus:**
- 

### Day 2 - [Date]
**What I accomplished:**
- 

**What I learned:**
- 

**Challenges faced:**
- 

**Tomorrow's focus:**
- 

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
