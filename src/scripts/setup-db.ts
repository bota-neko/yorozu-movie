import { db } from '../lib/db';
import { admins, settings } from '../lib/db/schema';
import { hashPassword } from '../lib/password';
import { eq } from 'drizzle-orm';

async function setup() {
  console.log('Setting up database...');

  // 1. Initial Admin
  const adminUsername = process.env.ADMIN_USERNAME || 'yorozu-admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '25y5c4c26cf2';
  
  const existingAdmin = await db.select().from(admins).where(eq(admins.username, adminUsername));
  
  if (existingAdmin.length === 0) {
    const passwordHash = await hashPassword(adminPassword);
    await db.insert(admins).values({
      username: adminUsername,
      passwordHash: passwordHash,
    });
    console.log(`Admin created: ${adminUsername}`);
  } else {
    console.log('Admin already exists.');
  }

  // 2. Initial Viewer Password
  const initialViewerPassword = process.env.INITIAL_VIEWER_PASSWORD || 'viewer123';
  const existingSettings = await db.select().from(settings).limit(1);

  if (existingSettings.length === 0) {
    const viewerPasswordHash = await hashPassword(initialViewerPassword);
    await db.insert(settings).values({
      viewerPasswordHash: viewerPasswordHash,
    });
    console.log('Initial settings created.');
  } else {
    console.log('Settings already exist.');
  }

  console.log('Database setup complete.');
}

setup().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
