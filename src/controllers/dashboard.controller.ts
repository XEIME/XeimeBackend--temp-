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

export const getSchoolAdminDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const schoolId = req.user?.schoolId;

    if (!schoolId) {
      return res.status(400).json({
        error: "Administrador sem escola associada.",
      });
    }

    const [
      school,
      totalStudents,
      totalTeachers,
      totalClasses,
      totalGrades,
    ] = await Promise.all([
      prisma.school.findUnique({
        where: {
          id: schoolId,
        },
        select: {
          name: true,
          address: true,
        },
      }),

      prisma.user.count({
        where: {
          schoolId,
          role: 'STUDENT',
        },
      }),

      prisma.user.count({
        where: {
          schoolId,
          role: 'TEACHER',
        },
      }),

      prisma.schoolClass.count({
        where: {
          schoolId,
        },
      }),

      prisma.schoolGrade.count({
        where: {
          schoolId,
        },
      }),
    ]);

    return res.json({
      school,

      statistics: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalGrades,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao carregar o dashboard.",
    });
  }
};