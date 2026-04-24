import { drizzle as drizzlePg } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const isPg = !!dbUrl;

let dbInstance: any;
let videosInstance: any;
let settingsInstance: any;
let adminsInstance: any;

if (isPg) {
  dbInstance = drizzlePg(sql, { schema });
  videosInstance = schema.videos;
  settingsInstance = schema.settings;
  adminsInstance = schema.admins;
} else {
  // Use require for better-sqlite3 to avoid loading native modules during Vercel build
  const { drizzle: drizzleSqlite } = require('drizzle-orm/better-sqlite3');
  const Database = require('better-sqlite3');
  const sqlite = new Database('sqlite.db');
  dbInstance = drizzleSqlite(sqlite, { schema });
  videosInstance = schema.videosSqlite;
  settingsInstance = schema.settingsSqlite;
  adminsInstance = schema.adminsSqlite;
}

export const db = dbInstance;
export const videos = videosInstance;
export const settings = settingsInstance;
export const admins = adminsInstance;
