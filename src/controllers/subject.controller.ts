import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getSubjects = async (_req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
    });

    return res.status(200).json({ data: subjects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar disciplinas." });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Nome da disciplina inválido." });
    }

    const existing = await prisma.subject.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return res.status(400).json({
        error: "Já existe uma disciplina com este nome.",
      });
    }

    const subject = await prisma.subject.create({
      data: { name: name.trim() },
    });

    return res.status(201).json({
      message: "Disciplina criada com sucesso.",
      data: subject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar disciplina." });
  }
};