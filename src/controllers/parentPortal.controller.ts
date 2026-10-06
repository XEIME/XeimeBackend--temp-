import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Role } from '../../generated/prisma/enums';

async function assertChildBelongsToParent(
  parentId: string,
  studentId: string,
  schoolId: string,
) {
  return prisma.user.findFirst({
    where: {
      id: studentId,
      parentId,
      schoolId,
      role: Role.STUDENT,
    },
    select: {
      id: true,
      name: true,
      classId: true,
      class: {
        select: {
          id: true,
          name: true,
          grade: { select: { name: true } },
        },
      },
    },
  });
}

export const getParentChildren = async (req: Request, res: Response) => {
  try {
    if (!req.user?.schoolId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const { id: parentId, schoolId } = req.user;

    const children = await prisma.user.findMany({
      where: {
        parentId,
        schoolId,
        role: Role.STUDENT,
      },
      select: {
        id: true,
        name: true,
        class: {
          select: {
            name: true,
            grade: { select: { name: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return res.status(200).json({ data: children });
  } catch {
    return res.status(500).json({ error: 'Erro ao carregar educandos.' });
  }
};

export const getStudentSituation = async (req: Request, res: Response) => {
  try {
    if (!req.user?.schoolId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const { id: parentId, schoolId } = req.user;
    const { studentId } = req.params;

    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ error: 'ID do educando obrigatório.' });
    }

    const student = await assertChildBelongsToParent(
      parentId,
      studentId,
      schoolId,
    );

    if (!student) {
      return res.status(404).json({ error: 'Educando não encontrado.' });
    }

    if (!student.classId) {
      return res.status(404).json({
        error: 'Este educando ainda não está associado a uma turma.',
      });
    }

    const [marks, attendances, homeworks] = await Promise.all([
      prisma.mark.findMany({
        where: { studentId },
        include: { subject: { select: { id: true, name: true } } },
        orderBy: [{ year: 'desc' }, { trimester: 'desc' }],
      }),
      prisma.attendance.findMany({
        where: {
          studentId,
          isPublished: true,
        },
        include: { subject: { select: { id: true, name: true } } },
        orderBy: { date: 'desc' },
        take: 30,
      }),
      prisma.homeWork.findMany({
        where: { classId: student.classId },
        include: { suject: { select: { id: true, name: true } } },
        orderBy: { dueData: 'asc' },
        take: 10,
      }),
    ]);

    return res.status(200).json({
      data: {
        student,
        marks,
        attendances,
        homeworks,
      },
    });
  } catch {
    return res.status(500).json({
      error: 'Erro ao carregar a situação do educando.',
    });
  }
};
