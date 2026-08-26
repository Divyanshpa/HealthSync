import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: Request) {
  try {
    const { 
      hospital_id, 
      action, 
      rejection_reason, 
      verification_notes, 
      admin_email,
      license_verified,
      address_verified,
      safety_verified,
    } = await request.json();

    if (!hospital_id || !action) {
      return NextResponse.json(
        { error: 'Missing hospital_id or action parameter.' },
        { status: 400 }
      );
    }

    const hospital = await prisma.hospitals.findUnique({
      where: { hospital_id: Number(hospital_id) },
    });

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital record not found.' }, { status: 404 });
    }

    const currentAdminEmail = admin_email || 'admin@digitalhealth.gov.in';

    if (action === 'APPROVE') {
      const year = new Date().getFullYear();
      const countApproved = await prisma.hospitals.count({
        where: { status: 'APPROVED' },
      });
      const serial = String(countApproved + 1).padStart(3, '0');
      const generatedCode = hospital.hospital_code || `HOSP-${year}-${serial}`;

      // Update hospital status & create audit verification log entry
      const updated = await prisma.hospitals.update({
        where: { hospital_id: Number(hospital_id) },
        data: {
          status: 'APPROVED',
          hospital_code: generatedCode,
          rejection_reason: null,
          verification_logs: {
            create: {
              admin_email: currentAdminEmail,
              action: 'APPROVED',
              license_verified: license_verified ?? true,
              address_verified: address_verified ?? true,
              safety_verified: safety_verified ?? true,
              verification_notes: verification_notes || 'All legal documents verified against state medical registry.',
            },
          },
        },
        include: {
          verification_logs: true,
          documents: true,
        },
      });

      return NextResponse.json({
        message: `Hospital '${updated.name}' verified & cleared for network operation!`,
        hospital: updated,
      }, { status: 200 });
    }

    if (action === 'REJECT') {
      const updated = await prisma.hospitals.update({
        where: { hospital_id: Number(hospital_id) },
        data: {
          status: 'REJECTED',
          rejection_reason: rejection_reason || 'License or legal document verification failed.',
          verification_logs: {
            create: {
              admin_email: currentAdminEmail,
              action: 'REJECTED',
              license_verified: Boolean(license_verified),
              address_verified: Boolean(address_verified),
              safety_verified: Boolean(safety_verified),
              verification_notes: rejection_reason || 'Legal document deficiency.',
            },
          },
        },
        include: {
          verification_logs: true,
          documents: true,
        },
      });

      return NextResponse.json({
        message: `Hospital application for '${updated.name}' rejected.`,
        hospital: updated,
      }, { status: 200 });
    }

    if (action === 'SUSPEND') {
      const updated = await prisma.hospitals.update({
        where: { hospital_id: Number(hospital_id) },
        data: {
          status: 'SUSPENDED',
          verification_logs: {
            create: {
              admin_email: currentAdminEmail,
              action: 'SUSPENDED',
              verification_notes: 'Hospital facility suspended from network.',
            },
          },
        },
        include: {
          verification_logs: true,
          documents: true,
        },
      });

      return NextResponse.json({
        message: `Hospital '${updated.name}' network status suspended.`,
        hospital: updated,
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action specified.' }, { status: 400 });

  } catch (error: any) {
    console.error('Error processing hospital admin action:', error);
    return NextResponse.json(
      { error: 'Internal system error processing hospital clearance.' },
      { status: 500 }
    );
  }
}
