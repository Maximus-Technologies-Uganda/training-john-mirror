import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

async function main() {
  const tasksFiles = [
    'specs/001-ui-scaffold-spec/tasks.md',
    'specs/002-todo-ui/tasks.md'
  ];

  for (const tasksFile of tasksFiles) {
    const tasksFilePath = resolve(process.cwd(), tasksFile);
    console.log(`\n=== Parsing ${tasksFile} ===`);

    try {
      const markdown = readFileSync(tasksFilePath, 'utf8');
      const tasks = parseTasks(markdown);

      console.log(`Found ${tasks.length} tasks:`);

      for (const task of tasks.slice(0, 5)) { // Show first 5 tasks
        console.log(`- ${task.id}: ${task.summary} [${task.checked ? 'DONE' : 'TODO'}]`);
        if (task.tags.length) {
          console.log(`  Tags: ${task.tags.join(', ')}`);
        }
        if (task.phase) {
          console.log(`  Phase: ${task.phase}`);
        }
      }

      if (tasks.length > 5) {
        console.log(`... and ${tasks.length - 5} more tasks`);
      }

      // Count by status
      const completed = tasks.filter(t => t.checked).length;
      const pending = tasks.filter(t => !t.checked).length;
      console.log(`\nStatus: ${completed} completed, ${pending} pending`);

    } catch (error) {
      console.error(`Error parsing ${tasksFile}:`, error.message);
    }
  }
}

main().catch((error) => {
  console.error('Test failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});

















