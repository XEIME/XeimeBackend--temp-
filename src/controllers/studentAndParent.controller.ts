import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '../../generated/prisma/enums';

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
    } = req.body;

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
          { OR: [{ email: parentEmail }, { phone: parentPhone }] },
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
            email: parentEmail,
            phone: parentPhone,
            password: await bcrypt.hash(parentPassword, 10),
            role: roleParent,
            schoolId: schoolId,
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
