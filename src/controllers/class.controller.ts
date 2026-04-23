import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Role } from '../../generated/prisma/enums';
import { CreateClassInput, UpdateClassInput } from '../schemas/class.schema';

// create classes
export const generetClass = async (req: Request, res: Response) => {
  try {
    const { name, gradeId } = req.body as CreateClassInput;
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      return res.status(403).json({
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
      return res.status(404).json({
        error:
          'A classe selecionada não foi encontrada ou não pertence a esta instituição.',
      });
    }

    const existingClass = await prisma.schoolClass.findFirst({
      where: {
        name: name,
        gradeId: gradeId,
        schoolId: schoolId,
      },
    });

    if (existingClass) {
      return res.status(409).json({
        error: 'Turma duplicada',
        message: `Já existe uma turma com o nome ${name} registada nesta classe.`,
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

//List classes by school

export const getClasses = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user.schoolId;
    const roleStudent = Role.STUDENT;

    if (!schoolId) {
      return res.status(403).json({
        error:
          'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.',
      });
    }

    const classes = await prisma.schoolClass.findMany({
      where: { schoolId },
      include: {
        grade: { select: { name: true } },
        _count: {
          select: { user: { where: { role: Role.STUDENT } } }, // Count the number of students in a classe
        },
      },
    });

    //function to count the number of students for each class
    const formattedClasses = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      gradeName: cls.grade.name,
      totalStudents: cls._count.user,
    }));

    return res.status(200).json(formattedClasses);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao tentar listar as Turmas' });
  }
};

//update
export const updateClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, gradeId } = req.body as UpdateClassInput;
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      return res
        .status(403)
        .json({ error: 'Acesso negado. Escola não vinculada.' });
    }

    if (!name || !gradeId) {
      return res.status(400).json({
        error: 'Faltam dados',
        message: 'O nome da turma e a classe são obrigatórios.',
      });
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID da class é obrigatório.' });
    }

    const existingClass = await prisma.schoolClass.findFirst({
      where: { id, schoolId },
    });

    if (!existingClass) {
      return res
        .status(404)
        .json({ error: 'Turma não encontrada nesta instituição.' });
    }

    //if the admin change the name or class, verify first
    const updateData: any = {};

    if (name) updateData.name = name;

    if (gradeId) {
      // Verify if the new grade belongs to the school.
      const gradeExists = await prisma.schoolGrade.findFirst({
        where: { id: gradeId, schoolId },
      });

      if (!gradeExists) {
        return res
          .status(404)
          .json({ error: 'A nova classe (Grade) selecionada é inválida.' });
      }

      updateData.gradeId = gradeId;
    }

    //verify is the change will generate a duplicate
    if (name || gradeId) {
      const duplicateCheck = await prisma.schoolClass.findFirst({
        where: {
          name: name || existingClass.name,
          gradeId: gradeId || existingClass.gradeId,
          schoolId,
          NOT: { id }, //Ignore the class we are editing.
        },
      });

      if (duplicateCheck) {
        return res.status(409).json({
          error: 'Conflito de Turmas',
          message: 'Já existe uma turma com esse nome nesta classe.',
        });
      }
    }

    const classUpdate = await prisma.schoolClass.update({
      where: { id },
      data: updateData,
    });

    return res.json({
      message: 'Turma atualizada com sucesso',
      classUpdate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao tentar atualizar a turma.' });
  }
};
