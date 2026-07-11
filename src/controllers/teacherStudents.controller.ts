import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Role } from "../../generated/prisma/enums";

export const getTeacherStudents = async (req: Request, res: Response) => {
  try {
    if (!req.user?.schoolId) {
      return res.status(403).json({
        error: "Acesso negado. Vínculo institucional em falta.",
      });
    }

    const { id: teacherId, schoolId } = req.user;

    const teacher = await prisma.user.findFirst({
      where: {
        id: teacherId,
        schoolId,
        role: Role.TEACHER,
      },
      select: {
        classId: true,
        class: {
          select: {
            id: true,
            name: true,
            grade: {
              select: {
                id: true,
                name: true,
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

    if (!teacher.classId || !teacher.class) {
      return res.status(404).json({
        error: "Este professor ainda não possui uma turma atribuída.",
      });
    }

    const students = await prisma.user.findMany({
      where: {
        schoolId,
        role: Role.STUDENT,
        classId: teacher.classId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      data: {
        class: {
          id: teacher.class.id,
          name: teacher.class.name,
          grade: teacher.class.grade.name,
        },
        students,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao carregar a lista de alunos.",
    });
  }
};