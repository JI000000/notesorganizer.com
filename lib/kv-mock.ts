import { kv } from '@vercel/kv';
import fs from 'fs/promises';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';
const mockDbPath = path.resolve(process.cwd(), 'local-mock-db.json');

async function readMockDb() {
  try {
    const data = await fs.readFile(mockDbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return an empty object
    return {};
  }
}

async function writeMockDb(data: any) {
  await fs.writeFile(mockDbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export const kvMock = {
  async set(key: string, value: any, options?: { ex: number }) {
    if (isDevelopment) {
      const db = await readMockDb();
      db[key] = { value, expires: options?.ex ? Date.now() + options.ex * 1000 : null };
      await writeMockDb(db);
      return 'OK';
    }
    return kv.set(key, value, options);
  },

  async get(key: string) {
    if (isDevelopment) {
      const db = await readMockDb();
      const record = db[key];
      if (!record) return null;
      if (record.expires && Date.now() > record.expires) {
        delete db[key];
        await writeMockDb(db);
        return null;
      }
      return record.value;
    }
    return kv.get(key);
  },
}; 