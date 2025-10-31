import axios from 'axios';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const linearApiKey = process.env.LINEAR_API_KEY;
const linearTeamId = process.env.LINEAR_TEAM_ID;

if (!linearApiKey) {
  console.error('Missing required environment variable: LINEAR_API_KEY');
  process.exit(1);
}

if (!linearTeamId) {
  console.error('Missing required environment variable: LINEAR_TEAM_ID');
  process.exit(1);
}

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

function findSpecFiles(dirPath, files = []) {
  const items = readdirSync(dirPath);

  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.')) {
      findSpecFiles(fullPath, files);
    } else if (item === 'spec.md') {
      files.push(fullPath);
    }
  }

  return files;
}

function parseSpecTitle(markdown) {
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    // Match H1 headings: # Title
    const match = trimmed.match(/^#\s+(.+)$/);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

function buildDescription(specPath, title) {
  const relativePath = specPath.replace(/\\/g, '/');
  const lines = [];
  lines.push('> _This issue is managed automatically from the feature specification. Manual edits may be overwritten._');
  lines.push('');
  lines.push(`**Specification**: \`${relativePath}\``);
  lines.push(`**Status**: Active feature specification`);
  lines.push('');
  lines.push('This issue tracks the implementation of the feature specification.');
  lines.push('The specification contains user stories, requirements, and acceptance criteria.');
  return lines.join('\n');
}

async function main() {
  const specsDir = resolve(process.cwd(), 'specs');
  const specFiles = findSpecFiles(specsDir);

  if (!specFiles.length) {
    console.warn(`No spec.md files found in ${specsDir}. Nothing to sync.`);
    return;
  }

  console.log(`Found ${specFiles.length} spec.md file(s) to sync to Linear.`);

  // Get existing issues in the team
  const existingQuery = `
    query GetTeamIssues($teamId: String!) {
      team(id: $teamId) {
        issues(first: 200) {
          nodes {
            id
            title
            description
          }
        }
      }
    }
  `;

  const teamData = await callGraphQL(existingQuery, { teamId: linearTeamId });
  const existingIssues = new Map();

  for (const issue of teamData?.team?.issues?.nodes ?? []) {
    existingIssues.set(issue.title, issue);
  }

  console.log(`Found ${existingIssues.size} existing issues in Linear team.`);

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const specPath of specFiles) {
    const markdown = readFileSync(specPath, 'utf8');
    const title = parseSpecTitle(markdown);

    if (!title) {
      console.warn(`Could not extract title from ${specPath}. Skipping.`);
      continue;
    }

    const description = buildDescription(specPath, title);
    const existing = existingIssues.get(title);

    if (!existing) {
      // Create new issue
      const createInput = {
        teamId: linearTeamId,
        title,
        description,
      };

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
      console.log(`Created Linear issue ${issueIdentifier ?? title}`);
      created += 1;
    } else {
      // Update existing issue if description changed
      const currentDescription = existing.description ?? '';
      if (currentDescription.trim() !== description.trim()) {
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

        await callGraphQL(updateMutation, { id: existing.id, input: { description } });
        console.log(`Updated Linear issue ${existing.title}`);
        updated += 1;
      } else {
        unchanged += 1;
      }
    }
  }

  console.log('Sync complete:', { created, updated, unchanged });
}

main().catch((error) => {
  console.error('Failed to sync specs to Linear:', error instanceof Error ? error.message : error);
  process.exit(1);
});
