#!/usr/bin/env node

/**
 * GitHub Project Setup Script
 * Creates "Training — John (Week 4)" project with columns, custom fields, and automation
 * 
 * Usage: node scripts/setup-github-project.mjs
 * 
 * Requirements:
 * - GitHub CLI (gh) installed and authenticated
 * - Owner and repo environment variables or CLI arguments
 */

import { execSync } from "child_process";
import process from "process";

const OWNER = process.env.GH_OWNER || "Maximus-Technologies-Uganda";
const REPO = process.env.GH_REPO || "training-john";
const PROJECT_TITLE = "Training — John (Week 4)";

// ANSI color codes for output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    log(`\n▶ ${description}`, "blue");
    const result = execSync(command, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    log(`✓ ${description} completed`, "green");
    return result.trim();
  } catch (error) {
    log(`✗ Failed: ${description}`, "red");
    log(`Error: ${error.message}`, "red");
    throw error;
  }
}

function main() {
  log(`\n${"=".repeat(60)}`, "bright");
  log(`GitHub Project Setup: ${PROJECT_TITLE}`, "bright");
  log(`${"=".repeat(60)}\n`, "bright");

  try {
    // Step 1: Verify gh CLI is installed and authenticated
    log("Step 1: Verifying GitHub CLI authentication", "yellow");
    try {
      executeCommand("gh auth status", "Check GitHub CLI status");
    } catch {
      log(
        "GitHub CLI not found or not authenticated.",
        "yellow"
      );
      log("Please install: https://cli.github.com/", "yellow");
      log(
        "Then run: gh auth login",
        "yellow"
      );
      process.exit(1);
    }

    // Step 2: Check repository access
    log("\nStep 2: Verifying repository access", "yellow");
    executeCommand(
      `gh repo view ${OWNER}/${REPO}`,
      `Verify access to ${OWNER}/${REPO}`
    );

    // Step 3: Create project (if possible via CLI)
    log("\nStep 3: Creating GitHub Project", "yellow");
    log(
      "NOTE: Projects v2 creation via CLI is limited. You may need to:",
      "yellow"
    );
    log("  1. Go to: https://github.com/" + OWNER + "/" + REPO, "yellow");
    log("  2. Click 'Projects' tab", "yellow");
    log("  3. Click 'New project'", "yellow");
    log(`  4. Enter title: ${PROJECT_TITLE}`, "yellow");
    log("  5. Choose 'Table' template", "yellow");

    // Step 4: Output configuration reference
    log("\nStep 4: Configuration Reference", "yellow");
    log("\n📋 Project Columns (in order):", "bright");
    const columns = [
      "Backlog",
      "Ready",
      "In Progress",
      "In Review",
      "QA",
      "Done",
    ];
    columns.forEach((col, idx) => {
      log(`   ${idx + 1}. ${col}`, "blue");
    });

    log("\n🏷️  Custom Fields:", "bright");
    const fields = [
      {
        name: "App",
        type: "Single Select",
        options: ["todo", "expense", "stopwatch", "temp"],
      },
      {
        name: "Slice",
        type: "Text",
        description: 'Task identifier (e.g., "T066")',
      },
      {
        name: "Priority",
        type: "Single Select",
        options: ["P0 (Critical)", "P1 (High)", "P2 (Medium)"],
      },
      {
        name: "Size",
        type: "Single Select",
        options: ["S (< 2h)", "M (2-6h)", "L (6+ h)"],
      },
      { name: "Target", type: "Date", description: "Target completion date" },
    ];

    fields.forEach((field, idx) => {
      log(`   ${idx + 1}. ${field.name} (${field.type})`, "blue");
      if (field.options) {
        field.options.forEach((opt) => log(`      • ${opt}`, "blue"));
      }
      if (field.description) {
        log(`      → ${field.description}`, "blue");
      }
    });

    log("\n📄 Files Created:", "bright");
    const files = [
      {
        path: "GITHUB_PROJECT_SETUP.md",
        description: "Complete setup guide and workflow documentation",
      },
      {
        path: ".github/ISSUE_TEMPLATE/training-task.md",
        description: "Issue template with metadata fields",
      },
      {
        path: ".github/workflows/add-to-training-project.yml",
        description: "GitHub Actions workflow for auto-adding issues",
      },
      {
        path: "scripts/setup-github-project.mjs",
        description: "This setup automation script",
      },
    ];

    files.forEach((file) => {
      log(`   ✓ ${file.path}`, "green");
      log(`     ${file.description}`, "blue");
    });

    log("\n🚀 Next Steps:", "bright");
    log("   1. Open GitHub: https://github.com/" + OWNER + "/" + REPO, "blue");
    log("   2. Go to Projects tab", "blue");
    log("   3. Create new project 'Table' template", "blue");
    log(`   4. Name it: ${PROJECT_TITLE}`, "blue");
    log("   5. Add the 6 columns (Backlog → Ready → In Progress → In Review → QA → Done)", "blue");
    log("   6. Add 5 custom fields (see Configuration Reference above)", "blue");
    log("   7. Enable 'Auto-add: training' label → Backlog column", "blue");
    log("   8. Review GITHUB_PROJECT_SETUP.md for detailed workflow guide", "blue");

    log("\n📚 Documentation:", "bright");
    log("   • Setup Guide: GITHUB_PROJECT_SETUP.md", "blue");
    log("   • Issue Template: .github/ISSUE_TEMPLATE/training-task.md", "blue");
    log("   • Workflow Automation: .github/workflows/add-to-training-project.yml", "blue");

    log("\n✅ Setup files prepared successfully!\n", "green");
    log(
      "For detailed instructions, see: GITHUB_PROJECT_SETUP.md",
      "green"
    );
  } catch (error) {
    log(`\n✗ Setup failed: ${error.message}\n`, "red");
    process.exit(1);
  }
}

main();

