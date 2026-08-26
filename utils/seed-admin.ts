import { prisma } from './prisma';
import crypto from 'crypto';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export async function ensureAdminSeeded() {
  try {
    const adminEmail = 'admin@digitalhealth.gov.in';
    const existing = await prisma.admin_users.findUnique({
      where: { email: adminEmail },
    });

    if (!existing) {
      const password_hash = hashPassword('Admin@123456');
      const newAdmin = await prisma.admin_users.create({
        data: {
          email: adminEmail,
          password_hash,
          name: 'Super Platform Administrator',
          role: 'SUPER_ADMIN',
        },
      });
      console.log('Default Super Admin seeded:', newAdmin.email);
    }
  } catch (error) {
    console.error('Error ensuring admin seeded:', error);
  }
}
