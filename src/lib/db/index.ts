import { drizzle as drizzlePg } from 'drizzle-orm/vercel-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { sql } from '@vercel/postgres';
import Database from 'better-sqlite3';
import * as schema from './schema';

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const isPg = !!dbUrl;

export const db = isPg
  ? drizzlePg(sql, { schema })
  : drizzleSqlite(new Database('sqlite.db'), { schema });

// Export the correct table objects based on the environment
export const videos = isPg ? schema.videos : (schema.videosSqlite as unknown as typeof schema.videos);
export const settings = isPg ? schema.settings : (schema.settingsSqlite as unknown as typeof schema.settings);
export const admins = isPg ? schema.admins : (schema.adminsSqlite as unknown as typeof schema.admins);
