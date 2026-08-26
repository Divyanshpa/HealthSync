import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: Request) {
  try {
    const { phone_number } = await request.json();

    if (!phone_number || typeof phone_number !== 'string') {
      return NextResponse.json({ error: 'Mobile number is required.' }, { status: 400 });
    }

    const cleanPhone = phone_number.replace(/\D/g, '');

    if (cleanPhone.length < 4) {
      return NextResponse.json({ error: 'Please enter a valid mobile number.' }, { status: 400 });
    }

    // Query patients with matching phone number
    const patients = await prisma.patients.findMany({
      where: { phone_number: cleanPhone },
      select: {
        patient_id: true,
        name: true,
        uhid: true,
        dob: true,
        sex: true,
        password_hash: true,
        created_at: true,
      },
      orderBy: { patient_id: 'asc' },
    });

    const sanitizedPatients = patients.map((p) => ({
      id: p.patient_id,
      name: p.name,
      uhid: p.uhid,
      dob: p.dob ? p.dob.toISOString().split('T')[0] : null,
      sex: p.sex,
      hasPassword: !!p.password_hash,
      createdAt: p.created_at,
    }));

    return NextResponse.json({
      count: sanitizedPatients.length,
      patients: sanitizedPatients,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error looking up patients by phone:', error);
    return NextResponse.json(
      { error: 'Failed to search registered profiles.' },
      { status: 500 }
    );
  }
}
