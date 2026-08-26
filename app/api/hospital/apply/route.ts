import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      license_number,
      type,
      email,
      phone,
      emergency_contact,
      address,
      city,
      state,
      pincode,
      departments,
      total_beds,
      icu_beds,
      ambulance_available,
      admin_contact_name,
      admin_contact_phone,
      documents, // Array of { document_type, file_name, file_url, file_size }
    } = body;

    // Validate required fields
    if (!name || !license_number || !type || !email || !phone || !address || !city || !state || !pincode || !admin_contact_name || !admin_contact_phone) {
      return NextResponse.json(
        { error: 'Missing required hospital registration parameters.' },
        { status: 400 }
      );
    }

    // Check if license number is already registered or pending
    const existingLicense = await prisma.hospitals.findUnique({
      where: { license_number: license_number.trim() },
    });

    if (existingLicense) {
      return NextResponse.json(
        { error: `Hospital with license number '${license_number}' is already registered or under review.` },
        { status: 409 }
      );
    }

    // Build relational documents payload
    const docsToCreate = Array.isArray(documents)
      ? documents
          .filter((doc) => doc && doc.file_url)
          .map((doc) => ({
            document_type: doc.document_type || 'GENERAL_PROOF',
            file_name: doc.file_name || 'Document.pdf',
            file_url: doc.file_url,
            file_size: doc.file_size || '1.0 MB',
          }))
      : [];

    // Create new hospital entry with nested relational documents
    const newHospital = await prisma.hospitals.create({
      data: {
        name: name.trim(),
        license_number: license_number.trim(),
        type: type || 'Multi-Specialty',
        email: email.trim(),
        phone: phone.trim(),
        emergency_contact: emergency_contact ? emergency_contact.trim() : phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        departments: Array.isArray(departments) ? departments : [],
        total_beds: Number(total_beds) || 0,
        icu_beds: Number(icu_beds) || 0,
        ambulance_available: Boolean(ambulance_available),
        admin_contact_name: admin_contact_name.trim(),
        admin_contact_phone: admin_contact_phone.trim(),
        status: 'PENDING',
        documents: {
          create: docsToCreate,
        },
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Hospital application & relational legal documents submitted successfully! Awaiting Super Admin inspection.',
        hospital_id: newHospital.hospital_id,
        license_number: newHospital.license_number,
        status: newHospital.status,
        documents_count: newHospital.documents.length,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error submitting hospital application:', error);
    return NextResponse.json(
      { error: 'Failed to submit hospital onboarding application.' },
      { status: 500 }
    );
  }
}
