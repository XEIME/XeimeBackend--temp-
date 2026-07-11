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


export const getTeacherDashboard = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user?.schoolId) {
      return res.status(403).json({
        error: "O seu utilizador não está vinculado a nenhuma escola.",
      });
    }

    const teacherId = req.user.id;

    const teacher = await prisma.user.findUnique({
      where: {
        id: teacherId,
      },
      include: {
        class: {
          include: {
            grade: true,
            _count: {
              select: {
                user: {
                  where: {
                    role: "STUDENT",
                  },
                },
                homeWorks: true,
                classProgress: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return res.status(404).json({
        error: "Professor não encontrado.",
      });
    }

    if (!teacher.class) {
      return res.status(404).json({
        error: "Este professor ainda não possui uma turma atribuída.",
      });
    }

    const totalTopics = await prisma.topic.count({
      where: {
        academicPlan: {
          gradeId: teacher.class.gradeId,
        },
      },
    });

    const totalAttendanceToday = await prisma.attendance.count({
      where: {
        classid: teacher.class.id,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    // Número de tópicos concluídos
    const completedTopics = teacher.class._count.classProgress;

    // Número de tópicos pendentes
    const pendingTopics = totalTopics - completedTopics;

    // Percentagem de conclusão do plano
    const completionPercentage =
      totalTopics === 0
        ? 0
        : Math.round((completedTopics / totalTopics) * 100);

    return res.json({
      teacher: {
        id: teacher.id,
        name: teacher.name,
      },

      class: {
        id: teacher.class.id,
        name: teacher.class.name,
        grade: teacher.class.grade.name,
      },

      statistics: {
        totalStudents: teacher.class._count.user,

        totalTopics,

        completedTopics,

        pendingTopics,

        completionPercentage,

        totalHomeworks: teacher.class._count.homeWorks,

        attendanceRegisteredToday: totalAttendanceToday,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao carregar os dados do dashboard do professor.",
    });
  }
}; 