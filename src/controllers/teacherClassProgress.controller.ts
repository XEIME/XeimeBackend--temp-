import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getClassProgressSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Vínculo institucional em falta.' });
    }
    const { schoolId } = req.user;
    const classId = req.query.classId as string;
    const subjectId = req.query.subjectId as string;

    if (!classId || !subjectId) {
      return res.status(400).json({ error: 'Parâmetros classId e subjectId são obrigatórios na query.' });
    }

    const schoolClass = await prisma.schoolClass.findFirst({ where: { id: classId, schoolId } });
    if (!schoolClass) return res.status(404).json({ message: 'Turma não identificada.' });

    const plan = await prisma.academicPlan.findFirst({
      where: { gradeId: schoolClass.gradeId, subjectId },
      include: { topic: true }
    });

    if (!plan) return res.status(404).json({ message: 'Nenhum plano analítico associado aos critérios.' });

    const totalTopics = plan.topic.length;
    const topicIds = plan.topic.map(t => t.id);

    const completedEntries = await prisma.classProgress.findMany({
      where: { classId, topicId: { in: topicIds } }
    });

    const completedCount = completedEntries.length;
    const remaining = totalTopics - completedCount;
    const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    return res.status(200).json({
      data: {
        className: schoolClass.name,
        planId: plan.id,
        metrics: { total: totalTopics, completed: completedCount, remaining, percentage }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao calcular progresso da turma.', error });
  }
};

export const getClassProgressTopics = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Vínculo institucional em falta.' });
    }
    const { schoolId } = req.user;
    const classId = req.query.classId as string;
    const subjectId = req.query.subjectId as string;

    if (!classId || !subjectId) {
      return res.status(400).json({ error: 'Parâmetros classId e subjectId são obrigatórios.' });
    }

    const schoolClass = await prisma.schoolClass.findFirst({ where: { id: classId, schoolId } });
    if (!schoolClass) return res.status(404).json({ message: 'Turma inválida.' });

    const plan = await prisma.academicPlan.findFirst({
      where: { gradeId: schoolClass.gradeId, subjectId },
      include: { topic: { orderBy: { weekNumber: 'asc' } } }
    });

    if (!plan) return res.status(404).json({ message: 'Plano analítico não encontrado.' });

    const completedProgress = await prisma.classProgress.findMany({
      where: { classId, topicId: { in: plan.topic.map(t => t.id) } }
    });

    const completedTopicIds = new Set(completedProgress.map(cp => cp.topicId));

    const mappedTopics = plan.topic.map(topic => ({
      ...topic,
      status: completedTopicIds.has(topic.id) ? 'Concluído' : 'Por concluir'
    }));

    return res.status(200).json({ data: mappedTopics });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar tópicos estruturados.', error });
  }
};

export const completeTopic = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    if (!topicId || typeof topicId !== 'string') {
      return res.status(400).json({ error: 'ID do tópico é obrigatório na rota.' });
    }

    if (!req.user || !req.user.id || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Utilizador não autenticado corretamente.' });
    }
    const { id: userId, schoolId } = req.user;
    const { classId } = req.body;

    if (!classId) return res.status(400).json({ error: 'O classId é obrigatório no corpo da requisição.' });

    const topic = await prisma.topic.findFirst({
      where: { id: topicId, academicPlan: { schoolGrade: { schoolId } } }
    });

    if (!topic) return res.status(404).json({ message: 'Tópico do plano não localizado.' });

    const existingProgress = await prisma.classProgress.findFirst({
      where: { classId, topicId }
    });

    if (existingProgress) {
      return res.status(400).json({ message: 'Este tópico já se encontra validado como concluído nesta turma.' });
    }

    const progress = await prisma.classProgress.create({
      data: {
        classId,
        topicId,
        completedById: userId
      }
    });

    return res.status(201).json({ message: 'Tópico marcado como concluído com sucesso.', data: progress });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao registar execução do tópico.', error });
  }
};