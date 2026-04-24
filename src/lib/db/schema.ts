import { pgTable, text, timestamp, boolean, integer, serial } from 'drizzle-orm/pg-core';
import { sqliteTable, text as textSqlite, integer as integerSqlite } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- PostgreSQL Schema (Vercel) ---
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  vimeoId: text('vimeo_id').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  sortOrder: integer('sort_order').default(0),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  viewerPasswordHash: text('viewer_password_hash').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- SQLite Schema (Local) ---
export const videosSqlite = sqliteTable('videos', {
  id: integerSqlite('id').primaryKey({ autoIncrement: true }),
  title: textSqlite('title').notNull(),
  vimeoId: textSqlite('vimeo_id').notNull(),
  description: textSqlite('description'),
  thumbnailUrl: textSqlite('thumbnail_url'),
  sortOrder: integerSqlite('sort_order').default(0),
  isPublished: integerSqlite('is_published', { mode: 'boolean' }).default(false),
  createdAt: integerSqlite('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integerSqlite('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const settingsSqlite = sqliteTable('settings', {
  id: integerSqlite('id').primaryKey({ autoIncrement: true }),
  viewerPasswordHash: textSqlite('viewer_password_hash').notNull(),
  updatedAt: integerSqlite('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export const adminsSqlite = sqliteTable('admins', {
  id: integerSqlite('id').primaryKey({ autoIncrement: true }),
  username: textSqlite('username').notNull().unique(),
  passwordHash: textSqlite('password_hash').notNull(),
  createdAt: integerSqlite('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integerSqlite('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});
