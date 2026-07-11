import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { Role } from '../../generated/prisma/enums';

export const createAcademicPlan = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.' });
    }
    const { schoolId } = req.user;
    const { gradeId, subjectId, trimester, year } = req.body;

    if (!gradeId || !subjectId) {
      return res.status(400).json({ error: 'Classe e Disciplina são obrigatórias.' });
    }

    const grade = await prisma.schoolGrade.findFirst({ where: { id: gradeId, schoolId } });
    if (!grade) return res.status(404).json({ message: 'Classe não encontrada nesta escola.' });

    const existingPlan = await prisma.academicPlan.findFirst({
      where: { gradeId, subjectId, trimester, year }
    });

    if (existingPlan) {
      return res.status(400).json({ message: 'Já existe um plano analítico configurado para estes parâmetros.' });
    }

    const plan = await prisma.academicPlan.create({
      data: { gradeId, subjectId, trimester, year }
    });

    return res.status(201).json({ message: 'Plano analítico criado com sucesso.', data: plan });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar o plano analítico.', error });
  }
};

export const getAcademicPlans = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.' });
    }
    const { schoolId } = req.user;

    const plans = await prisma.academicPlan.findMany({
      where: { schoolGrade: { schoolId } },
      include: { schoolGrade: true, subject: true, _count: { select: { topic: true } } }
    });
    return res.status(200).json({ data: plans });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar planos analíticos.', error });
  }
};

export const getAcademicPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do plano analítico é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.' });
    }
    const { schoolId } = req.user;

    const plan = await prisma.academicPlan.findFirst({
      where: { id, schoolGrade: { schoolId } },
      include: { topic: { orderBy: { weekNumber: 'asc' } }, schoolGrade: true, subject: true }
    });

    if (!plan) return res.status(404).json({ message: 'Plano analítico não encontrado.' });
    return res.status(200).json({ data: plan });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao obter plano analítico.', error });
  }
};

export const updateAcademicPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do plano analítico é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.' });
    }
    const { schoolId } = req.user;

    const plan = await prisma.academicPlan.findFirst({ where: { id, schoolGrade: { schoolId } } });
    if (!plan) return res.status(404).json({ message: 'Plano analítico não encontrado.' });

    const updatedPlan = await prisma.academicPlan.update({
      where: { id },
      data: req.body
    });

    return res.status(200).json({ message: 'Plano atualizado com sucesso.', data: updatedPlan });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar plano analítico.', error });
  }
};

export const addTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do plano analítico é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.' });
    }
    const { schoolId } = req.user;

    const plan = await prisma.academicPlan.findFirst({ where: { id, schoolGrade: { schoolId } } });
    if (!plan) return res.status(404).json({ message: 'Plano analítico não encontrado.' });

    const topic = await prisma.topic.create({
      data: { ...req.body, planId: id }
    });

    return res.status(201).json({ message: 'Tópico adicionado com sucesso.', data: topic });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao adicionar tópico.', error });
  }
};

export const getTopicsByPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do plano analítico é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.' });
    }
    const { schoolId } = req.user;

    const plan = await prisma.academicPlan.findFirst({ where: { id, schoolGrade: { schoolId } } });
    if (!plan) return res.status(404).json({ message: 'Plano analítico não encontrado.' });

    const topics = await prisma.topic.findMany({
      where: { planId: id },
      orderBy: { weekNumber: 'asc' }
    });

    return res.status(200).json({ data: topics });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar tópicos.', error });
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do tópico é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.' });
    }
    const { schoolId } = req.user;

    const topic = await prisma.topic.findFirst({
      where: { id, academicPlan: { schoolGrade: { schoolId } } }
    });

    if (!topic) return res.status(404).json({ message: 'Tópico não encontrado ou sem permissão.' });

    const updatedTopic = await prisma.topic.update({
      where: { id },
      data: req.body
    });

    return res.status(200).json({ message: 'Tópico updated com sucesso.', data: updatedTopic });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar tópico.', error });
  }
};

export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do tópico é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. O seu utilizador não está vinculado a nenhuma escola.' });
    }
    const { schoolId } = req.user;

    const topic = await prisma.topic.findFirst({
      where: { id, academicPlan: { schoolGrade: { schoolId } } }
    });

    if (!topic) return res.status(404).json({ message: 'Tópico não encontrado ou sem permissão.' });

    await prisma.topic.delete({ where: { id } });
    return res.status(200).json({ message: 'Tópico removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover tópico.', error });
  }
};