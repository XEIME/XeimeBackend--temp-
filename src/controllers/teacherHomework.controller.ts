import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createHomework = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Sem escola associada.' });
    }
    const { schoolId } = req.user;
    const { classId, subjectId, title, description, dueData } = req.body;

    if (!classId || !subjectId) {
      return res.status(400).json({ error: 'Falta mapear a classe e a disciplina.' });
    }

    const schoolClass = await prisma.schoolClass.findFirst({ where: { id: classId, schoolId } });
    if (!schoolClass) return res.status(404).json({ message: 'Turma inválida.' });

    const homework = await prisma.homeWork.create({
      data: {
        classId,
        subjectId,
        title,
        description,
        dueData: new Date(dueData)
      }
    });

    return res.status(201).json({ message: 'TPC criado com sucesso.', data: homework });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao gerar TPC.', error });
  }
};

export const getHomeworks = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Escola não especificada.' });
    }
    const { schoolId } = req.user;

    const homeworks = await prisma.homeWork.findMany({
      where: { class: { schoolId } },
      include: { class: true, suject: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ data: homeworks });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar trabalhos.', error });
  }
};

export const updateHomework = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do TPC é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    const { schoolId } = req.user;

    const homework = await prisma.homeWork.findFirst({ where: { id, class: { schoolId } } });
    if (!homework) return res.status(404).json({ message: 'TPC não localizado.' });

    const updated = await prisma.homeWork.update({
      where: { id },
      data: req.body
    });

    return res.status(200).json({ message: 'TPC atualizado com sucesso.', data: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao modificar TPC.', error });
  }
};

export const deleteHomework = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do TPC é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    const { schoolId } = req.user;

    const homework = await prisma.homeWork.findFirst({ where: { id, class: { schoolId } } });
    if (!homework) return res.status(404).json({ message: 'TPC indisponível.' });

    await prisma.homeWork.delete({ where: { id } });
    return res.status(200).json({ message: 'TPC eliminado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover TPC.', error });
  }
};