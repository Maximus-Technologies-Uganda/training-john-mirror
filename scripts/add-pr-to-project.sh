#!/bin/bash

#############################################################################
# Add PR to GitHub Project - Automated Script
# 
# This script adds a pull request to a GitHub project using gh CLI
# 
# Usage: ./scripts/add-pr-to-project.sh <PR_NUMBER> <PROJECT_NAME>
#
# Environment Variables Required:
#   GH_TOKEN - GitHub Personal Access Token with repo and projects scopes
#
# Example:
#   export GH_TOKEN="ghp_xxxxxxxxxx"
#   ./scripts/add-pr-to-project.sh 975 "training-john"
#############################################################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PR_NUMBER="${1:-}"
PROJECT_NAME="${2:-}"
REPO_URL=$(git config --get remote.origin.url 2>/dev/null || echo "unknown")

#############################################################################
# Helper Functions
#############################################################################

print_header() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

#############################################################################
# Validation Functions
#############################################################################

validate_inputs() {
  print_header "Validating Inputs"
  
  if [[ -z "$PR_NUMBER" ]]; then
    print_error "PR_NUMBER not provided"
    echo "Usage: ./scripts/add-pr-to-project.sh <PR_NUMBER> <PROJECT_NAME>"
    echo "Example: ./scripts/add-pr-to-project.sh 975 training-john"
    exit 1
  fi
  
  if [[ -z "$PROJECT_NAME" ]]; then
    print_error "PROJECT_NAME not provided"
    echo "Usage: ./scripts/add-pr-to-project.sh <PR_NUMBER> <PROJECT_NAME>"
    echo "Example: ./scripts/add-pr-to-project.sh 975 training-john"
    exit 1
  fi
  
  # Validate PR number is numeric
  if ! [[ "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
    print_error "PR_NUMBER must be numeric: $PR_NUMBER"
    exit 1
  fi
  
  print_success "Inputs validated (PR: #$PR_NUMBER, Project: $PROJECT_NAME)"
}

validate_token() {
  print_header "Validating GitHub Token"
  
  if [[ -z "$GH_TOKEN" ]]; then
    print_error "GH_TOKEN environment variable not set"
    echo ""
    echo "To use this script, set your GitHub Personal Access Token:"
    echo "  export GH_TOKEN=\"ghp_xxxxxxxxxx\""
    echo ""
    echo "Create a token at: https://github.com/settings/tokens"
    echo "Required scopes:"
    echo "  - repo (full repository access)"
    echo "  - read:project (read GitHub projects)"
    echo "  - write:project (write to GitHub projects)"
    exit 1
  fi
  
  print_success "GH_TOKEN is set"
}

validate_gh_cli() {
  print_header "Validating GitHub CLI"
  
  if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed"
    echo "Install from: https://cli.github.com/"
    exit 1
  fi
  
  print_success "GitHub CLI installed: $(gh --version)"
}

check_auth() {
  print_header "Checking Authentication"
  
  if ! gh auth status &> /dev/null; then
    print_error "Not authenticated to GitHub"
    echo "Run: gh auth login"
    exit 1
  fi
  
  # Get authenticated user
  AUTH_USER=$(gh api user --jq '.login' 2>/dev/null || echo "unknown")
  print_success "Authenticated as: $AUTH_USER"
}

#############################################################################
# GitHub Operations
#############################################################################

verify_pr_exists() {
  print_header "Verifying PR #$PR_NUMBER Exists"
  
  if ! gh pr view "$PR_NUMBER" &> /dev/null; then
    print_error "PR #$PR_NUMBER not found or not accessible"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check PR number: gh pr list"
    echo "  2. Verify token has repo access"
    echo "  3. Verify you're in the correct repository"
    exit 1
  fi
  
  # Get PR details
  PR_TITLE=$(gh pr view "$PR_NUMBER" --json title -q '.title' 2>/dev/null || echo "unknown")
  print_success "PR #$PR_NUMBER found: $PR_TITLE"
}

verify_project_exists() {
  print_header "Verifying Project \"$PROJECT_NAME\" Exists"
  
  if ! gh project list --jq '.[] | select(.title == "'"$PROJECT_NAME"'")' &> /dev/null; then
    print_warning "Project \"$PROJECT_NAME\" might not exist or might not be accessible"
    echo ""
    echo "Available projects:"
    gh project list --jq '.[] | .title' 2>/dev/null || echo "  (unable to list projects)"
    echo ""
    print_warning "Will attempt to add PR to project anyway..."
  else
    print_success "Project \"$PROJECT_NAME\" found"
  fi
}

add_pr_to_project() {
  print_header "Adding PR #$PR_NUMBER to Project \"$PROJECT_NAME\""
  
  if gh pr edit "$PR_NUMBER" --add-project "$PROJECT_NAME" 2>/dev/null; then
    print_success "Successfully added PR #$PR_NUMBER to project \"$PROJECT_NAME\""
    return 0
  else
    print_error "Failed to add PR to project"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Verify GH_TOKEN has 'write:project' scope"
    echo "  2. Verify project name: gh project list"
    echo "  3. Try using project number instead of name: gh pr edit 975 --add-project 1"
    return 1
  fi
}

#############################################################################
# Main Execution
#############################################################################

main() {
  echo ""
  print_header "GitHub PR Project Automation"
  echo "PR: #$PR_NUMBER"
  echo "Project: $PROJECT_NAME"
  echo "Repository: $REPO_URL"
  echo ""
  
  # Validation steps
  validate_inputs
  validate_token
  validate_gh_cli
  check_auth
  verify_pr_exists
  verify_project_exists
  
  # Execute operation
  echo ""
  if add_pr_to_project; then
    echo ""
    print_header "Success!"
    print_success "PR #$PR_NUMBER is now in project \"$PROJECT_NAME\""
    echo ""
    echo "View project: gh project view --web"
    echo "View PR: gh pr view $PR_NUMBER --web"
    exit 0
  else
    echo ""
    print_error "Operation failed - see details above"
    exit 1
  fi
}

# Run main function
main "$@"

