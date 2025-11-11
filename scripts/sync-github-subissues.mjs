import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { readdirSync, statSync } from 'node:fs';

const githubToken = process.env.GITHUB_TOKEN;
const githubRepo = process.env.GITHUB_REPOSITORY;
const tasksFileRelative = process.env.GITHUB_TASKS_FILE ?? '';

if (!githubToken) {
  console.error('Missing required environment variable: GITHUB_TOKEN');
  process.exit(1);
}

if (!githubRepo) {
  console.error('Missing required environment variable: GITHUB_REPOSITORY');
  process.exit(1);
}

function findTasksFiles(dirPath, files = []) {
  const items = readdirSync(dirPath);

  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.')) {
      findTasksFiles(fullPath, files);
    } else if (item === 'tasks.md') {
      files.push(fullPath);
    }
  }

  return files;
}

function parseTasks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tasks = [];
  let phase = '';
  let section = '';

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) {
      phase = line.replace(/^##\s+/, '').trim();
      section = '';
      continue;
    }

    if (/^###\s+/.test(line)) {
      section = line.replace(/^###\s+/, '').trim();
      continue;
    }

    const match = line.match(/^-\s+\[( |x)\]\s+(T\d{3})\s+(.*)$/i);
    if (!match) {
      continue;
    }

    const [, checkbox, taskId, remainder] = match;
    const tags = [];
    let rest = remainder;

    while (true) {
      const tagMatch = rest.match(/^\[([^\]]+)\]\s*/);
      if (!tagMatch) {
        break;
      }
      tags.push(tagMatch[1]);
      rest = rest.slice(tagMatch[0].length);
    }

    const summary = rest.trim();
    if (!summary) {
      continue;
    }

    const titleBase = summary.replace(/\.$/, '');
    const title = `${taskId}: ${titleBase}`;

    tasks.push({
      id: taskId,
      checked: checkbox.toLowerCase() === 'x',
      tags,
      summary,
      phase,
      section,
      rawLine: line,
      title,
    });
  }

  return tasks;
}

function buildDescription(task, filePath) {
  const lines = [];
  lines.push('> _This sub-issue is managed automatically from the tasks specification. Manual edits may be overwritten._');
  lines.push('');
  lines.push(`**Task ID:** ${task.id}`);
  lines.push(`**Spec Status:** ${task.checked ? 'Complete' : 'Pending'}`);
  if (task.phase) {
    lines.push(`**Phase:** ${task.phase}`);
  }
  if (task.section) {
    lines.push(`**Section:** ${task.section}`);
  }
  if (task.tags.length) {
    lines.push(`**Tags:** ${task.tags.map((tag) => `\`${tag}\``).join(', ')}`);
  }
  lines.push(`**Source:** \`${filePath}\``);
  lines.push('');
  lines.push('**Original task line:**');
  lines.push('```markdown');
  lines.push(task.rawLine);
  lines.push('```');
  return lines.join('\n');
}

function getExistingIssues() {
  try {
    const output = execSync(`gh issue list --repo ${githubRepo} --json number,title,labels --limit 1000`, {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_TOKEN: githubToken }
    });
    const issues = JSON.parse(output);
    const issueMap = new Map();
    for (const issue of issues) {
      issueMap.set(issue.title, issue);
    }
    return issueMap;
  } catch (error) {
    console.warn('Failed to fetch existing issues, assuming none exist:', error.message);
    return new Map();
  }
}

function createIssue(title, body, labels) {
  const labelArgs = labels.map(label => `--label "${label}"`).join(' ');
  const command = `gh issue create --repo ${githubRepo} --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}" ${labelArgs}`;

  try {
    const output = execSync(command, {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_TOKEN: githubToken }
    });
    const issueUrl = output.trim();
    const issueNumber = issueUrl.split('/').pop();
    return { number: parseInt(issueNumber), url: issueUrl };
  } catch (error) {
    throw new Error(`Failed to create GitHub issue: ${error.message}`);
  }
}

function updateIssue(issueNumber, title, body, labels) {
  const labelArgs = labels.map(label => `--add-label "${label}"`).join(' ');
  const command = `gh issue edit ${issueNumber} --repo ${githubRepo} --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}" ${labelArgs}`;

  try {
    execSync(command, {
      encoding: 'utf8',
      env: { ...process.env, GITHUB_TOKEN: githubToken }
    });
    return true;
  } catch (error) {
    throw new Error(`Failed to update GitHub issue #${issueNumber}: ${error.message}`);
  }
}

function getIssueLabels(task) {
  const labels = ['subtask', 'automated'];

  if (task.checked) {
    labels.push('completed');
  } else {
    labels.push('todo');
  }

  if (task.tags.length) {
    labels.push(...task.tags.map(tag => tag.toLowerCase()));
  }

  return labels;
}

async function main() {
  const specsDir = resolve(process.cwd(), 'specs');

  // If a specific tasks file is provided, use only that one
  const tasksFiles = tasksFileRelative
    ? [resolve(process.cwd(), tasksFileRelative)]
    : findTasksFiles(specsDir);

  if (!tasksFiles.length) {
    console.warn(`No tasks.md files found${tasksFileRelative ? ` at ${tasksFileRelative}` : ` in ${specsDir}`}. Nothing to sync.`);
    return;
  }

  console.log(`Found ${tasksFiles.length} tasks.md file(s) to sync to GitHub issues.`);

  const existingIssues = getExistingIssues();
  console.log(`Found ${existingIssues.size} existing GitHub issues.`);

  let totalCreated = 0;
  let totalUpdated = 0;
  let totalUnchanged = 0;

  for (const tasksFile of tasksFiles) {
    const relativePath = tasksFile.replace(/\\/g, '/').replace(/^.*\/specs\//, 'specs/');
    const markdown = readFileSync(tasksFile, 'utf8');
    const tasks = parseTasks(markdown);

    if (!tasks.length) {
      console.warn(`No tasks detected in ${relativePath}. Skipping.`);
      continue;
    }

    console.log(`Syncing ${tasks.length} tasks from ${relativePath} to GitHub issues.`);

    let created = 0;
    let updated = 0;
    let unchanged = 0;

    for (const task of tasks) {
      const description = buildDescription(task, relativePath);
      const labels = getIssueLabels(task);
      const existing = existingIssues.get(task.title);

      if (!existing) {
        // Create new issue
        try {
          const result = createIssue(task.title, description, labels);
          console.log(`Created GitHub issue #${result.number}: ${task.title}`);
          created += 1;
        } catch (error) {
          console.error(`Failed to create issue for ${task.title}:`, error.message);
        }
        continue;
      }

      // Update existing issue
      const currentLabels = existing.labels?.map(l => l.name) || [];
      const needsLabelUpdate = !labels.every(label => currentLabels.includes(label));

      if (needsLabelUpdate) {
        try {
          updateIssue(existing.number, task.title, description, labels);
          console.log(`Updated GitHub issue #${existing.number}: ${task.title}`);
          updated += 1;
        } catch (error) {
          console.error(`Failed to update issue #${existing.number}:`, error.message);
        }
      } else {
        unchanged += 1;
      }
    }

    console.log(`File ${relativePath} sync complete:`, { created, updated, unchanged });
    totalCreated += created;
    totalUpdated += updated;
    totalUnchanged += unchanged;
  }

  console.log('Overall sync complete:', { created: totalCreated, updated: totalUpdated, unchanged: totalUnchanged });
}

main().catch((error) => {
  console.error('Failed to sync GitHub sub-issues:', error instanceof Error ? error.message : error);
  process.exit(1);
});

















