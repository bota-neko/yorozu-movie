import { pgTable, text, timestamp, boolean, integer, serial } from 'drizzle-orm/pg-core';

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
