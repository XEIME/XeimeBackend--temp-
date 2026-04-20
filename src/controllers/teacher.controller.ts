import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '../../generated/prisma/enums';

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const {
      teacherName,
      teacherEmail,
      teacherPhone,
      teacherPassword,
      teacherClass,
      teacherGrade,
    } = req.body;

    const schoolId = req.user.schoolId;
    const role = Role.TEACHER;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: teacherEmail }, { phone: teacherPhone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          'Este e-mail ou número de telefone já está em uso por outro utilizador.',
      });
    }

    if (!schoolId) {
      return res.status(403).json({
        error:
          'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.',
      });
    }

    const classFind = await prisma.schoolClass.findFirst({
      where: { id: teacherClass, gradeId: teacherGrade, schoolId: schoolId },
    });

    if (!classFind) {
      return res.status(400).json({
        error:
          'Verifique se a classe e a turma selecionadas são válidas e pertencem a esta escola.',
      });
    }

    const isClassOccupied = await prisma.user.findFirst({
      where: {
        role: role,
        classId: teacherClass,
      },
    });

    if (isClassOccupied) {
      return res.status(409).json({
        error:
          'Esta turma já tem um professor regente atribuído. Remova o professor atual antes de atribuir um novo',
      });
    }

    const hashedPassword = await bcrypt.hash(teacherPassword, 10);

    const teacher = await prisma.user.create({
      data: {
        name: teacherName,
        email: teacherEmail,
        phone: teacherPhone,
        password: hashedPassword,
        classId: teacherClass,
        schoolId,
        role,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return res
      .status(201)
      .json({ message: 'o professor foi criado com sucesso.', teacher });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Erro ao tentar cadastrar o professor' });
  }
};

//listar todos os teachers da escola..
export const listTeachers = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user.schoolId;
    const role = Role.TEACHER;

    const teacherList = await prisma.user.findMany({
      where: {
        schoolId: schoolId,
        role: role,
      },
      select: {
        id: true,
        name: true,
        role: true,
        phone: true,
      },
    });

    return res.json({
      message: `A escola tem um total de ${teacherList.length} Professores.`,
      teacherList,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro ao tentar carregar a lista de Professores' });
  }
};

// Ver datalhes de um certo teacher pegando o di dele pelo parametro..
export const getTeacherDetalhes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do professor é obrigatório.' });
    }

    const role = Role.TEACHER;
    const schoolId = req.user.schoolId;

    const teacher = await prisma.user.findFirst({
      where: {
        id: id,
        role: role,
        schoolId: schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
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

    if (!teacher) {
      return res.status(404).json({ error: 'Proffesor não encontrado' });
    }

    return res.json({ teacher });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao tentar carregar os detalhes do professor.',
    });
  }
};

//Actualizar dados do professor
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do professor é obrigatório.' });
    }

    const schoolId = req.user.schoolId;
    const role = Role.TEACHER;

    if (!schoolId) {
      return res.status(403).json({
        error:
          'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.',
      });
    }

    const {
      teacherName,
      teacherEmail,
      teacherPhone,
      teacherClass,
      teacherGrade,
    } = req.body;

    const teacher = await prisma.user.findUnique({
      where: {
        id: id,
        role: role,
      },
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: teacherEmail }, { phone: teacherPhone }],
        NOT: { id: id },
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          'Este e-mail ou número de telefone já está em uso por outro utilizador.',
      });
    }

    const classFind = await prisma.schoolClass.findFirst({
      where: { id: teacherClass, gradeId: teacherGrade, schoolId: schoolId },
    });

    if (!classFind) {
      return res.status(400).json({
        error:
          'Verifique se a classe e a turma selecionadas são válidas e pertencem a esta escola.',
      });
    }

    const isClassOccupied = await prisma.user.findFirst({
      where: {
        role: role,
        classId: teacherClass,
        NOT: { id: id },
      },
    });

    if (isClassOccupied) {
      return res.status(409).json({
        error:
          'Esta turma já tem um professor regente atribuído. Remova o professor atual antes de atribuir um novo',
      });
    }

    const teacherUpdate = await prisma.user.update({
      where: {
        id: id,
        schoolId: schoolId,
      },
      data: {
        name: teacherName,
        email: teacherEmail,
        phone: teacherPhone,
        classId: teacherClass,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.json({
      message: 'Dados actulizados com sucesso',
      teacherUpdate,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error ao tentar actulizar as informções' });
  }
};

//To be continued......
