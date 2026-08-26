import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { ensureAdminSeeded } from '@/utils/seed-admin';
import crypto from 'crypto';

function verifyPassword(passwordToTest: string, storedSecureHash: string): boolean {
  try {
    const [salt, originalHash] = storedSecureHash.split(':');
    if (!salt || !originalHash) return false;
    const testHash = crypto.pbkdf2Sync(passwordToTest, salt, 1000, 64, 'sha512').toString('hex');
    return testHash === originalHash;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Ensure default admin user is seeded
    await ensureAdminSeeded();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing admin email or password.' }, { status: 400 });
    }

    const admin = await prisma.admin_users.findUnique({
      where: { email: email.trim() },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const isValid = verifyPassword(password, admin.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Admin authentication successful',
      admin: {
        id: admin.admin_id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in admin auth route:', error);
    return NextResponse.json({ error: 'Internal server error during admin authentication.' }, { status: 500 });
  }
}
