import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export function loadData(filePath) {
  if (fs.existsSync(filePath)) {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  }
  return []; // Return empty array if file doesn't exist
}

export function saveData(data, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}