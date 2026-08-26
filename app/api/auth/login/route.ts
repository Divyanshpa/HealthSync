import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import crypto from 'crypto';

function verifyPassword(passwordToTest: string, storedSecureHash: string): boolean {
  try {
    const [salt, originalHash] = storedSecureHash.split(':');
    if (!salt || !originalHash) return false;
    // Re-hash using the same salt
    const testHash = crypto.pbkdf2Sync(passwordToTest, salt, 1000, 64, 'sha512').toString('hex');
    // Compare hashes
    return testHash === originalHash;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { uhid, password } = await request.json();

    if (!uhid || !password) {
      return NextResponse.json({ error: 'Missing UHID or password.' }, { status: 400 });
    }

    // Find the patient by UHID
    const patient = await prisma.patients.findUnique({
      where: { uhid },
      select: { patient_id: true, name: true, uhid: true, password_hash: true },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Invalid Patient ID or Password.' }, { status: 401 });
    }

    // If the user exists but hasn't set up a password yet
    if (!patient.password_hash) {
      return NextResponse.json(
        { error: 'Account not fully initialized. Please complete registration.' },
        { status: 403 }
      );
    }

    const isPasswordValid = verifyPassword(password, patient.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid Patient ID or Password.' }, { status: 401 });
    }

    // Success
    return NextResponse.json({
      message: 'Authentication successful',
      patient: {
        id: patient.patient_id,
        name: patient.name,
        uhid: patient.uhid,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in login route:', error);
    return NextResponse.json({ error: 'Internal server error during authentication.' }, { status: 500 });
  }
}