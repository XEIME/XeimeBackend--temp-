import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const generetClass = async (req: Request, res: Response) => {
  try {
    const { name, gradeId } = req.body;
    const schoolId = req.user.schoolId;

    if (!name || !gradeId) {
      return res
        .status(400)
        .json({
          error: 'Faltam dados',
          message: 'O nome da turma e a classe são obrigatórios.',
        });
    }

    if (!schoolId) {
      return res
        .status(403)
        .json({
          error:
            'Acesso negado. O seu utilizador não está vinculado a nenhuma escola',
        });
    }

    const findGrade = await prisma.schoolGrade.findFirst({
      where: {
        id: gradeId,
        schoolId: schoolId,
      },
    });

    if (!findGrade) {
      return res
        .status(404)
        .json({
          error:
            'A classe selecionada não foi encontrada ou não pertence a esta instituição.',
        });
    }

    const existingClass = await prisma.schoolClass.findFirst({
      where: {
        name: name,
        gradeId: gradeId,
      },
    });

    if (existingClass) {
      return res.status(409).json({
        error: 'Turma duplicada',
        message:
          "Já existe uma turma com o nome '${name}' registada nesta classe.",
      });
    }

    const createClass = await prisma.schoolClass.create({
      data: {
        name: name,
        gradeId: gradeId,
        schoolId: schoolId,
      },
    });

    return res
      .status(201)
      .json({ message: 'A turma foi criada com sucesso ', createClass });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao tentar criar a turma.' });
  }
};
