import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Role } from '../../generated/prisma/enums';

//List all stundets of a school
export const getStudents = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user.schoolId;
    const roleStudent = Role.STUDENT;

    

    const Studentslist = await prisma.user.findMany({
      where: {
        schoolId: schoolId,
        role: roleStudent,
      },
      select: {
        id: true,
        name: true,
        class: {
          select: {
            name: true,
            grade: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.json({
      message: `A escola tem um total de ${Studentslist.length} Alunos`,
      Studentslist,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro ao tentar carregar a lista de Alunos' });
  }
};

//Get detalhe info of any student by Id from prams

export const getStudentsDetalhes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do aluno é obrigatório.' });
    }

    const roleStudent = Role.STUDENT;
    const schoolId = req.user.schoolId;

    const student = await prisma.user.findFirst({
      where: {
        id: id,
        role: roleStudent,
        schoolId: schoolId,
      },
      select: {
        id: true,
        name: true,
        class: {
          select: {
            name: true,
            grade: {
              select: {
                name: true,
              },
            },
          },
        },
        parent: {
          select: {
            name: true,
            phone: true,
            address: true,
          },
        },
      },
    });

     if (!student) {
      return res
        .status(404)
        .json({ error: 'Aluno não encontrado' });
    }

    return res.json({
      student,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao tentar carregar os detalhes do aluno.',
    });
  }
};
