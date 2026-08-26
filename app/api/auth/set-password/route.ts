import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import crypto from 'crypto';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export async function POST(request: Request) {
  try {
    const { uhid, password } = await request.json();

    if (!uhid || !password) {
      return NextResponse.json({ error: 'Missing UHID or password parameters.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const secureHash = hashPassword(password);

    const updated = await prisma.patients.update({
      where: { uhid },
      data: { password_hash: secureHash },
      select: { patient_id: true, name: true, uhid: true },
    });

    return NextResponse.json(
      { message: 'Security credentials established successfully! You can now log in.', uhid: updated.uhid },
      { status: 200 }
    );

  } catch (error: any) {
    // Prisma throws P2025 when the record is not found
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Invalid or non-existent Patient ID sequence.' }, { status: 404 });
    }
    console.error('Error setting password:', error);
    return NextResponse.json({ error: 'Internal system fault updating credentials.' }, { status: 500 });
  }
}