import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const launchMark = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Vínculo escolar obrigatório.' });
    }
    const { schoolId } = req.user;
    const { studentId, subjectId, trimester, type, value, year } = req.body;

    if (!studentId || !subjectId) {
      return res.status(400).json({ error: 'Estudante e Disciplina obrigatórios.' });
    }

    const student = await prisma.user.findFirst({ where: { id: studentId, schoolId, role: 'STUDENT' } });
    if (!student) return res.status(404).json({ message: 'Estudante não registado nesta instituição.' });

    const existingMark = await prisma.mark.findFirst({
      where: { studentId, subjectId, trimester, year, type }
    });

    if (existingMark) {
      return res.status(400).json({ message: 'Já existe uma nota deste tipo registada para o aluno neste trimestre/ano.' });
    }

    const mark = await prisma.mark.create({
      data: { studentId, subjectId, trimester, type, value, year }
    });

    return res.status(201).json({ message: 'Nota pedagógica lançada com sucesso.', data: mark });
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno ao publicar nota.', error });
  }
};

export const updateMark = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID da avaliação é mandatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
    }
    const { schoolId } = req.user;
    const { value } = req.body;

    const mark = await prisma.mark.findFirst({ where: { id, student: { schoolId } } });
    if (!mark) return res.status(404).json({ message: 'Registo de nota não localizado.' });

    const updatedMark = await prisma.mark.update({
      where: { id },
      data: { value }
    });

    return res.status(200).json({ message: 'Nota retificada com sucesso.', data: updatedMark });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao retificar nota.', error });
  }
};

export const getMarks = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Vínculo institucional necessário.' });
    }
    const { schoolId } = req.user;

    const marks = await prisma.mark.findMany({
      where: { student: { schoolId } },
      include: { student: true, subject: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ data: marks });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar pauta de aproveitamento escolar.', error });
  }
};