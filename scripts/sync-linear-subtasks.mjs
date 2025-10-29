import axios from 'axios';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const linearApiKey = process.env.LINEAR_API_KEY;
const parentIssueId = process.env.LINEAR_PARENT_ISSUE_ID;
const tasksFileRelative = process.env.LINEAR_TASKS_FILE ?? 'specs/001-ui-scaffold-spec/tasks.md';

if (!linearApiKey) {
  console.error('Missing required environment variable: LINEAR_API_KEY');
  process.exit(1);
}

if (!parentIssueId) {
  console.error('Missing required environment variable: LINEAR_PARENT_ISSUE_ID');
  process.exit(1);
}

const tasksFilePath = resolve(process.cwd(), tasksFileRelative);

const client = axios.create({
  baseURL: 'https://api.linear.app/graphql',
  headers: {
    'Content-Type': 'application/json',
    Authorization: linearApiKey,
  },
  timeout: 15000,
});

async function callGraphQL(query, variables) {
  try {
    const response = await client.post('', { query, variables });
    if (response.data?.errors?.length) {
      throw new Error(JSON.stringify(response.data.errors, null, 2));
    }
    return response.data?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const payload = error.response?.data;
      throw new Error(`Linear API request failed${status ? ` (status ${status})` : ''}: ${JSON.stringify(payload, null, 2)}`);
    }
    throw error;
  }
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
  lines.push(`**Task ID:** \
${task.id}`);
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

function selectStateIds(states) {
  const findByType = (types) => states.find((state) => types.includes(state.type))?.id;
  return {
    completed: findByType(['completed']),
    unstarted: findByType(['unstarted', 'backlog', 'triage']),
  };
}

async function main() {
  const markdown = readFileSync(tasksFilePath, 'utf8');
  const tasks = parseTasks(markdown);

  if (!tasks.length) {
    console.warn(`No tasks detected in ${tasksFileRelative}. Nothing to sync.`);
    return;
  }

  const parentQuery = `
    query ParentIssue($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        team {
          id
          name
          states(first: 50) {
            nodes {
              id
              name
              type
            }
          }
        }
        children(first: 200) {
          nodes {
            id
            title
            description
            state {
              id
              type
            }
          }
        }
      }
    }
  `;

  const parentData = await callGraphQL(parentQuery, { id: parentIssueId });
  const parentIssue = parentData?.issue;

  if (!parentIssue) {
    throw new Error(`Linear parent issue ${parentIssueId} not found.`);
  }

  const teamStates = parentIssue.team?.states?.nodes ?? [];
  const stateIds = selectStateIds(teamStates);

  const existingIssues = new Map();
  for (const child of parentIssue.children?.nodes ?? []) {
    existingIssues.set(child.title, child);
  }

  console.log(`Syncing ${tasks.length} tasks to Linear parent ${parentIssue.identifier} (${parentIssue.title}).`);

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const task of tasks) {
    const description = buildDescription(task, tasksFileRelative);
    const desiredStateId = task.checked ? stateIds.completed : stateIds.unstarted;

    const existing = existingIssues.get(task.title);

    if (!existing) {
      const createInput = {
        teamId: parentIssue.team.id,
        parentId: parentIssue.id,
        title: task.title,
        description,
      };

      if (desiredStateId) {
        createInput.stateId = desiredStateId;
      }

      const mutation = `
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            issue {
              id
              identifier
              title
            }
          }
        }
      `;

      const createResult = await callGraphQL(mutation, { input: createInput });
      const issueIdentifier = createResult?.issueCreate?.issue?.identifier;
      console.log(`Created Linear sub-issue ${issueIdentifier ?? task.title}`);
      created += 1;
      continue;
    }

    const updates = {};
    const currentDescription = existing.description ?? '';
    if (currentDescription.trim() !== description.trim()) {
      updates.description = description;
    }

    if (desiredStateId && existing.state?.id !== desiredStateId) {
      updates.stateId = desiredStateId;
    }

    if (Object.keys(updates).length === 0) {
      unchanged += 1;
      continue;
    }

    const updateMutation = `
      mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          issue {
            id
            identifier
            title
          }
        }
      }
    `;

    await callGraphQL(updateMutation, { id: existing.id, input: updates });
    console.log(`Updated Linear sub-issue ${existing.title}`);
    updated += 1;
  }

  console.log('Sync complete:', { created, updated, unchanged });
}

main().catch((error) => {
  console.error('Failed to sync Linear sub-issues:', error instanceof Error ? error.message : error);
  process.exit(1);
});

