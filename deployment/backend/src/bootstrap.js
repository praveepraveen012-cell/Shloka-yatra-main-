import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

export const ADMIN_INITIAL_EMAIL = 'admin@shloka.com';
export const ADMIN_TEMPORARY_PASSWORD = 'ShlokaAdmin@2027';

export async function bootstrapAdmin(force = false) {
  try {
    const isTest = process.env.NODE_ENV === 'test' || process.env.npm_lifecycle_event?.includes('test');
    const shouldForce = force || isTest;
    const passwordHash = await bcrypt.hash(ADMIN_TEMPORARY_PASSWORD, 10);

    const primaryAdmin = await prisma.user.findUnique({
      where: { email: 'admin@shloka.com' },
    });

    if (!primaryAdmin) {
      await prisma.user.create({
        data: {
          email: 'admin@shloka.com',
          passwordHash,
          name: 'Shloka Administrator',
          phone: '+91 6366852888',
          role: 'SUPER_ADMIN',
          mustChangePassword: true,
        },
      });
      console.log('✅ Super Admin account bootstrapped: admin@shloka.com');
    } else {
      const updateData = { role: 'SUPER_ADMIN' };
      if (shouldForce) {
        updateData.passwordHash = passwordHash;
        updateData.mustChangePassword = true;
      }
      await prisma.user.update({
        where: { id: primaryAdmin.id },
        data: updateData,
      });
    }

    const alias = await prisma.user.findUnique({
      where: { email: 'admin@shlloka.com' },
    });
    if (!alias) {
      await prisma.user.create({
        data: {
          email: 'admin@shlloka.com',
          passwordHash,
          name: 'Shloka Administrator',
          phone: '+91 6366852888',
          role: 'SUPER_ADMIN',
          mustChangePassword: true,
        },
      });
    } else {
      const updateData = { role: 'SUPER_ADMIN' };
      if (shouldForce) {
        updateData.passwordHash = passwordHash;
        updateData.mustChangePassword = true;
      }
      await prisma.user.update({
        where: { id: alias.id },
        data: updateData,
      });
    }

    // Deactivate any legacy staff roles so only SUPER_ADMIN holds administrative privileges
    await prisma.user.updateMany({
      where: {
        role: { in: ['ADMIN', 'FINANCE', 'TRAVEL_OPS', 'SUPPORT', 'CONTENT_MANAGER', 'STAFF'] },
        email: { notIn: ['admin@shloka.com', 'admin@shlloka.com'] },
      },
      data: {
        role: 'STAFF_INACTIVE',
      },
    });

    // Bootstrap Official Document Templates (Draft 1.0 – 23 November 2026)
    const templates = [
      {
        documentRef: 'SYPL-MED-2027',
        title: 'Shlloka Yatra 2027 – Medical Fitness & Clinical Clearance Certificate',
        category: 'MEDICAL',
        version: 'Draft 1.0 – 23 November 2026',
        lifecycleStatus: 'DRAFT',
        isApproved: false,
        templateFilePath: 'server/public/templates/Shlloka_Yatra_2027_Medical_Fitness_Certificate.pdf',
        description: 'Mandatory clinical clearance form for high-altitude pilgrimage up to 5,630m. Contains participant health self-declaration (16 conditions) and registered physician clinical assessment and certification with photo seal.',
        clausesCount: 16,
      },
      {
        documentRef: 'SYPL-RISK-2027',
        title: 'Shlloka Yatra 2027 – Participant Declaration, Assumption of Inherent Risk, and Limited Indemnity',
        category: 'COMPLIANCE',
        version: 'Draft 1.0 – 23 November 2026',
        lifecycleStatus: 'DRAFT',
        isApproved: false,
        templateFilePath: 'server/public/templates/Shlloka_Yatra_2027_Risk_Declaration_and_Indemnity.pdf',
        description: 'Official 5-page risk declaration: 24 numbered clauses (Sections 1-7), 5 page-by-page initials, 8 direct acknowledgements (Section 8), Emergency Contact & High-Altitude Travel Insurance (Section 9), and Participant Execution & Witness (Section 10).',
        clausesCount: 24,
      },
      {
        documentRef: 'SYPL-INS-2027',
        title: 'Shlloka Yatra 2027 – High-Altitude Travel & Emergency Evacuation Insurance Policy Proof',
        category: 'INSURANCE',
        version: 'Draft 1.0 – 23 November 2026',
        lifecycleStatus: 'DRAFT',
        isApproved: false,
        templateFilePath: null,
        description: 'Official proof of mandatory specialized high-altitude travel insurance with emergency medical evacuation and repatriation up to 6,000m.',
        clausesCount: 1,
      },
    ];

    for (const t of templates) {
      const existing = await prisma.documentTemplate.findUnique({
        where: { documentRef: t.documentRef },
      });
      if (!existing) {
        await prisma.documentTemplate.create({ data: t });
      } else {
        await prisma.documentTemplate.update({
          where: { documentRef: t.documentRef },
          data: {
            title: t.title,
            category: t.category,
            version: t.version,
            lifecycleStatus: existing.lifecycleStatus || t.lifecycleStatus,
            isApproved: existing.isApproved ?? t.isApproved,
            templateFilePath: t.templateFilePath,
            description: t.description,
            clausesCount: t.clausesCount,
          },
        });
      }
    }
  } catch (error) {
    console.error('Error during admin bootstrap:', error);
  }
}
