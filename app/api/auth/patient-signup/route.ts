import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone_number, name, dob, sex, address, known_allergies, preexisting_conditions } = body;

    // Validate required fields
    if (!phone_number || !name || !dob || !sex || !address) {
      return NextResponse.json(
        { error: 'Missing required registration fields.' },
        { status: 400 }
      );
    }

    // Generate sequential UHID (YYYYMM######)
    const now = new Date();
    const prefix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Count existing patients this month to determine the next serial number
    const count = await prisma.patients.count({
      where: { uhid: { startsWith: prefix } },
    });
    const nextSerial = String(count + 1).padStart(6, '0');
    const generatedUhid = `${prefix}${nextSerial}`;

    // Insert patient record; password_hash is intentionally null until step 2
    const newPatient = await prisma.patients.create({
      data: {
        uhid: generatedUhid,
        phone_number,
        name,
        dob: new Date(dob),
        sex,
        address,
        known_allergies: known_allergies || [],
        preexisting_conditions: preexisting_conditions || [],
      },
      select: { patient_id: true, uhid: true },
    });

    return NextResponse.json(
      { message: 'Initial profile registered successfully!', uhid: newPatient.uhid },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error in patient-signup route:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}