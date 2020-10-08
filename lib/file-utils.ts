import fs from 'fs';
import path from 'path';

// Create "db" directory if it doesn't exist.
export const createDbDir = (): void => {
  const dir = path.join(__dirname, 'db');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log('Made dir:', dir);
  } else {
    console.log('Dir exists:', dir);
  }
};

