import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getSuperAdminDashboard = async (req: Request, res: Response) => {
  try {
    const [totalSchools, totalAdmins, totalTeachers, totalStudents] =
      await Promise.all([
        prisma.school.count(),
        prisma.user.count({
          where: {
            role: 'SCHOOL_ADMIN',
          },
        }),
        prisma.user.count({
          where: {
            role: 'TEACHER',
          },
        }),
        prisma.user.count({
          where: {
            role: 'STUDENT',
          },
        }),
      ]);

    return res.json({
      statistics: {
        totalSchools,
        totalAdmins,
        totalTeachers,
        totalStudents,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Erro ao carregar os dados do dashboard.',
    });
  }
};
