import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Role } from '../../generated/prisma/enums';

export const getStudentDashboard = async (req: Request, res: Response) => {
  try {
    if (!req.user?.schoolId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const { id: studentId, schoolId } = req.user;

    const student = await prisma.user.findFirst({
      where: { id: studentId, schoolId, role: Role.STUDENT },
      select: {
        id: true,
        name: true,
        classId: true,
        class: {
          select: {
            name: true,
            grade: { select: { name: true } },
          },
        },
      },
    });

    if (!student?.classId) {
      return res.status(404).json({
        error: "Aluno sem turma associada.",
      });
    }

    const [marks, attendances, homeworks] = await Promise.all([
      prisma.mark.findMany({
        where: { studentId },
        include: { subject: { select: { id: true, name: true } } },
      }),
      prisma.attendance.findMany({
        where: { studentId, isPublished: true },
        orderBy: { date: "desc" },
        take: 30,
      }),
      prisma.homeWork.findMany({
        where: { classId: student.classId },
        include: { suject: { select: { id: true, name: true } } },
        orderBy: { dueData: "asc" },
        take: 5,
      }),
    ]);

    return res.status(200).json({
      data: { student, marks, attendances, homeworks },
    });
  } catch {
    return res.status(500).json({ error: "Erro ao carregar dashboard." });
  }
};