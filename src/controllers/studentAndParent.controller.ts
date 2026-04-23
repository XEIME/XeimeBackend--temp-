import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '../../generated/prisma/enums';
import {
  CreateStudentAndParentInput,
  UpdateStudentAndParentInput,
} from '../schemas/studentAndParent.schema';

export const creatStudentAndParent = async (req: Request, res: Response) => {
  try {
    const {
      studentUsername,
      studentPin,
      studentName,
      studentClass,
      parentName,
      parentEmail,
      parentPhone,
      parentPassword,
    } = req.body as CreateStudentAndParentInput;

    const schoolId = req.user.schoolId;
    const roleStudent = Role.STUDENT;
    const roleParent = Role.PARENT;

    if (!schoolId) {
      return res.status(403).json({
        error:
          'Acesso negado. o seu utlizador não está vinculado a nenhuma escola.',
      });
    }

    const existngClass = await prisma.schoolClass.findFirst({
      where: {
        id: studentClass,
      },
    });

    if (!existngClass) {
      return res.status(400).json({
        message:
          'Verifique se a classe selecionada é válida e pertence a está escola.',
      });
    }

    const existingStudent = await prisma.user.findFirst({
      where: {
        email: studentUsername,
        schoolId: schoolId,
      },
    });

    if (existingStudent) {
      return res.status(400).json({
        message: 'Esse username já esta a ser usado por outro estudante',
      });
    }

    const existingParent = await prisma.user.findFirst({
      where: {
        AND: [
          { OR: [{ email: parentEmail ?? null }, { phone: parentPhone }] },
          { schoolId: schoolId },
        ],
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      let parentId = existingParent?.id;

      const hashedStudentPin = await bcrypt.hash(studentPin, 10);

      if (!parentId) {
        const newParent = await tx.user.create({
          data: {
            name: parentName,
            phone: parentPhone,
            password: await bcrypt.hash(parentPassword, 10),
            role: roleParent,
            schoolId: schoolId,
            ...(parentEmail && { email: parentEmail }), // it just add the key 'email' it they is valeu
          },
        });
        parentId = newParent.id;
      }

      const newStudent = await tx.user.create({
        data: {
          name: studentName,
          email: studentUsername,
          password: hashedStudentPin,
          parentId: parentId,
          classId: studentClass,
          role: roleStudent,
          schoolId: schoolId,
        },
      });

      return { parentId, student: newStudent };
    });

    return res.status(201).json({
      message: 'Cadastro realizado com Sucesso!',
      result,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao processar cadastro.',
    });
  }
};

//update
export const updateStudentAndParent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Student Id
    const schoolId = req.user.schoolId;
    const role = Role.STUDENT;
    const data = req.body as UpdateStudentAndParentInput;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do aluno é obrigatório.' });
    }

    if (!schoolId) {
      return res.status(403).json({
        error:
          'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.',
      });
    }

    // serching for the student using the id
    const student = await prisma.user.findUnique({
      where: { id: id, schoolId: schoolId, role: role },

      select: { parentId: true },
    });

    if (!student)
      return res.status(404).json({ error: 'Estudante não encontrado' });

    const studentData: any = {};
    if (data.studentName) studentData.name = data.studentName;
    if (data.studentUsername) studentData.email = data.studentUsername;
    if (data.studentClass) studentData.classId = data.studentClass;

    const parentData: any = {};
    if (data.parentName) parentData.name = data.parentName;
    if (data.parentEmail) parentData.email = data.parentEmail;
    if (data.parentPhone) parentData.phone = data.parentPhone;

    await prisma.$transaction(async (tx) => {
      // student update
      if (Object.keys(studentData).length > 0) {
        await tx.user.update({ where: { id }, data: studentData });
      }

      // parent update (if they is data and the student has an parentId)
      if (student.parentId && Object.keys(parentData).length > 0) {
        await tx.user.update({
          where: { id: student.parentId },
          data: parentData,
        });
      }
    });

    return res.json({ message: 'Dados atualizados com sucesso!' });
  } catch (error: any) {
    if (error.code === 'P2002')
      return res
        .status(400)
        .json({ error: 'Dados duplicados (Email, Telefone ou Username)' });
    return res.status(500).json({ error: 'Erro ao atualizar.' });
  }
};
