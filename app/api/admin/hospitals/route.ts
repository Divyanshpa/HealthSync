import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let whereCondition = {};
    if (statusFilter && statusFilter !== 'ALL') {
      whereCondition = { status: statusFilter };
    }

    // Fetch all hospitals with relational documents and audit clearance logs
    const hospitals = await prisma.hospitals.findMany({
      where: whereCondition,
      include: {
        documents: true,
        verification_logs: {
          orderBy: { created_at: 'desc' },
        },
      },
      orderBy: { hospital_id: 'desc' },
    });

    // Compute metrics
    const totalHospitals = await prisma.hospitals.count();
    const pendingCount = await prisma.hospitals.count({ where: { status: 'PENDING' } });
    const approvedCount = await prisma.hospitals.count({ where: { status: 'APPROVED' } });
    const rejectedCount = await prisma.hospitals.count({ where: { status: 'REJECTED' } });
    const suspendedCount = await prisma.hospitals.count({ where: { status: 'SUSPENDED' } });

    const totalBedsResult = await prisma.hospitals.aggregate({
      where: { status: 'APPROVED' },
      _sum: { total_beds: true, icu_beds: true },
    });

    return NextResponse.json({
      hospitals,
      summary: {
        totalHospitals,
        pendingCount,
        approvedCount,
        rejectedCount,
        suspendedCount,
        totalBeds: totalBedsResult._sum.total_beds || 0,
        icuBeds: totalBedsResult._sum.icu_beds || 0,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching hospitals for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospital records for admin overview.' },
      { status: 500 }
    );
  }
}
