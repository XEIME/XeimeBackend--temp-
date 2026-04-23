import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '../../generated/prisma/enums';
import { CreateTeacherInput, UpdateTeacherInput } from '../schemas/teacher.schema';

//create teacher and pleace him/her in a grade and class
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const {
      teacherName,
      teacherEmail,
      teacherPhone,
      teacherPassword,
      teacherClass,
      teacherGrade,
    } = req.body as CreateTeacherInput;

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

    //Check Class existence and School ownership
    const classFind = await prisma.schoolClass.findFirst({
      where: { id: teacherClass, gradeId: teacherGrade, schoolId: schoolId },
    });

    if (!classFind) {
      return res.status(400).json({
        error:
          'Verifique se a classe e a turma selecionadas são válidas e pertencem a esta escola.',
      });
    }

    //Ensure the class is not already occupied
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
      .json({ message: 'O professor foi criado com sucesso.', teacher });
  } catch (error: any) {
    if (error.code === 'P2002') {
        return res.status(400).json({ error: "O Email ou numero de telefone já em uso" });
    }
    // console.error(error);
    return res
      .status(500)
      .json({ error: 'Erro ao tentar cadastrar o professor' });
  }
};

//list all teachers of the schools
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

// get teacher detalhes by params
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

//Update teacher data
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
    } = req.body as UpdateTeacherInput;

    const teacher = await prisma.user.findUnique({
      where: {
        id: id,
        role: role,
      },
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    // Build update object dynamically to avoid 'undefined' keys
    const updateData: any = {};
    if (teacherName) updateData.name = teacherName;
    if (teacherEmail) updateData.email = teacherEmail;
    if (teacherPhone) updateData.phone = teacherPhone;
    if (teacherClass) updateData.classId = teacherClass;

    // If changing class, must re-verify availability
    if (teacherClass && teacherGrade) {
        const classFind = await prisma.schoolClass.findFirst({
            where: { id: teacherClass, gradeId: teacherGrade, schoolId },
        });
        if (!classFind) return res.status(400).json({ error: 'Verifique se a classe e a turma selecionadas são válidas e pertencem a esta escola.' });

        const isClassOccupied = await prisma.user.findFirst({
            where: { role: Role.TEACHER, classId: teacherClass, NOT: { id } },
        });
        if (isClassOccupied) return res.status(409).json({ error: 'Esta turma já tem um professor regente atribuído. Remova o professor atual antes de atribuir um novo' });
    }

    const teacherUpdate = await prisma.user.update({
      where: {
        id: id,
        schoolId: schoolId, //Ensures only admins of the SAME school can update
      },
      data: updateData,
      select: { id: true, name: true, email: true, role: true },
    });

    return res.json({
      message: 'Dados actulizados com sucesso',
      teacherUpdate,
    });
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(400).json({ error: "Este e-mail ou número de telefone já está em uso por outro utilizador." });
    return res
      .status(500)
      .json({ error: 'Error ao tentar actulizar as informções' });
  }
};

//To be continued......
