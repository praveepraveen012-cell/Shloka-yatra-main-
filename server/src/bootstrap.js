import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

export const ADMIN_INITIAL_EMAIL = 'admin@shloka.com';
export const ADMIN_TEMPORARY_PASSWORD = 'ShlokaAdmin@2027';

export async function bootstrapAdmin() {
  try {
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
          role: 'ADMIN',
          mustChangePassword: true,
        },
      });
      console.log('✅ Master Admin account bootstrapped: admin@shloka.com');
    } else {
      await prisma.user.update({
        where: { id: primaryAdmin.id },
        data: {
          passwordHash,
          role: 'ADMIN',
          mustChangePassword: true,
        },
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
          role: 'ADMIN',
          mustChangePassword: true,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: alias.id },
        data: {
          passwordHash,
          role: 'ADMIN',
          mustChangePassword: true,
        },
      });
    }
  } catch (error) {
    console.error('Error during admin bootstrap:', error);
  }
}
