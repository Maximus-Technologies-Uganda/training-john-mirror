#!/usr/bin/env node

import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

function safeReadJson(filePath) {
  try {
    if (!existsSync(filePath)) {
      return null;
    }
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function formatPercent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }
  return `${value.toFixed(1)}%`;
}

function buildTableRows(entries) {
  return entries.map((entry) => {
    const { label, link, summary = {} } = entry;
    const cells = [
      `<td><a href="${link}">${label}</a></td>`,
      `<td>${formatPercent(summary?.statements)}</td>`,
      `<td>${formatPercent(summary?.branches)}</td>`,
      `<td>${formatPercent(summary?.functions)}</td>`,
      `<td>${formatPercent(summary?.lines)}</td>`
    ];
    return `<tr>${cells.join('')}</tr>`;
  }).join('\n');
}

function discoverCoverageRoots(baseDir) {
  const roots = [];

  try {
    const children = readdirSync(baseDir);
    for (const child of children) {
      if (child === 'lcov-report') {
        continue;
      }
      const childPath = join(baseDir, child);
      if (!statSync(childPath).isDirectory()) {
        continue;
      }
      if (child === 'coverage' || child.startsWith('coverage')) {
        roots.push({ label: child.replace(/^coverage[-_]?/, ''), path: childPath, relative: child });
      }
    }
  } catch {
    // Ignore directories we cannot read
  }

  return roots;
}

function resolveCoverageEntries() {
  const artifactsRoot = resolve('review-artifacts');
  const candidates = [];

  if (existsSync(artifactsRoot) && statSync(artifactsRoot).isDirectory()) {
    const roots = discoverCoverageRoots(artifactsRoot);
    roots.forEach((root) => {
      candidates.push({
        label: root.label || 'workspace',
        directory: root.path,
        link: `${root.relative}/index.html`,
        summary: safeReadJson(join(root.path, 'coverage-summary.json'))?.total ?? null
      });
    });

    const summary = safeReadJson(join(artifactsRoot, 'coverage-summary.json'));
    if (summary?.total) {
      candidates.unshift({
        label: 'workspace',
        directory: artifactsRoot,
        link: 'coverage/index.html',
        summary: summary.total
      });
    }
  }

  if (candidates.length === 0) {
    const localCoverage = resolve('coverage');
    if (existsSync(localCoverage) && statSync(localCoverage).isDirectory()) {
      candidates.push({
        label: 'workspace',
        directory: localCoverage,
        link: join(localCoverage, 'index.html'),
        summary: safeReadJson(join(localCoverage, 'coverage-summary.json'))?.total ?? null,
        isAbsolute: true
      });

      const nestedRoots = discoverCoverageRoots(localCoverage);
      nestedRoots.forEach((root) => {
        candidates.push({
          label: root.label || 'coverage',
          directory: root.path,
          link: join(root.path, 'index.html'),
          summary: safeReadJson(join(root.path, 'coverage-summary.json'))?.total ?? null,
          isAbsolute: true
        });
      });
    }
  }

  return candidates.filter((entry) => entry.summary);
}

function generateCoverageIndex() {
  const entries = resolveCoverageEntries();

  if (entries.length === 0) {
    console.log('No coverage directories found; skipping coverage index generation.');
    return;
  }

  const rows = buildTableRows(entries.map((entry) => ({
    label: entry.label,
    link: entry.isAbsolute ? entry.link : entry.link,
    summary: entry.summary
  })));

  const generatedAt = new Date().toISOString();

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Coverage Index</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #fafafa; color: #222; margin: 2rem; }
    h1 { margin-bottom: 0.5rem; }
    table { border-collapse: collapse; min-width: 420px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #ddd; text-align: left; }
    th { background: #1f2937; color: #f9fafb; }
    tr:nth-child(even) td { background: #f3f4f6; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    footer { margin-top: 1rem; font-size: 0.875rem; color: #4b5563; }
  </style>
</head>
<body>
  <h1>Coverage Index</h1>
  <p>Select a report below to view detailed coverage metrics.</p>
  <table>
    <thead>
      <tr>
        <th>Report</th>
        <th>Statements</th>
        <th>Branches</th>
        <th>Functions</th>
        <th>Lines</th>
      </tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <footer>Generated: ${generatedAt}</footer>
</body>
</html>`;

  writeFileSync(join(resolve('review-artifacts'), 'index.html'), html, 'utf8');
  console.log('Coverage index generated at review-artifacts/index.html');
}

generateCoverageIndex();

