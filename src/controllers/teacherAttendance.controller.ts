import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const createAttendance = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Vínculo com a escola indisponível.' });
    }
    const { schoolId } = req.user;
    const { classid, subjectId, date, records } = req.body;

    if (!classid || !subjectId || !records) {
      return res.status(400).json({ error: 'Campos classid, subjectId e records são obrigatórios.' });
    }

    const schoolClass = await prisma.schoolClass.findFirst({ where: { id: classid, schoolId } });
    if (!schoolClass) return res.status(404).json({ message: 'Turma não identificada.' });

    const attendanceDate = date ? new Date(date) : new Date();

    const operations = records.map((record: any) => 
      prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: record.studentId,
            subjectId,
            date: attendanceDate
          }
        },
        update: { status: record.status, note: record.note },
        create: {
          classid,
          subjectId,
          studentId: record.studentId,
          status: record.status,
          note: record.note,
          date: attendanceDate,
          isPublished: false
        }
      })
    );

    await prisma.$transaction(operations);
    return res.status(201).json({ message: 'Presenças salvas em modo rascunho com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao registar presenças.', error });
  }
};

export const getAttendances = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Escola não especificada.' });
    }
    const { schoolId } = req.user;
    const { classid, subjectId } = req.query;

    if (!classid || !subjectId) {
      return res.status(400).json({ error: 'Filtros classid e subjectId obrigatórios.' });
    }

    const attendances = await prisma.attendance.findMany({
      where: {
        classid: classid as string,
        subjectId: subjectId as string,
        class: { schoolId }
      },
      include: { student: true, subject: true }
    });

    return res.status(200).json({ data: attendances });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar presenças.', error });
  }
};

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID do registo de presença é obrigatório.' });
    }

    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Sem dados da escola.' });
    }
    const { schoolId } = req.user;
    const { status, note } = req.body;

    const attendance = await prisma.attendance.findFirst({
      where: { id, class: { schoolId } }
    });

    if (!attendance) return res.status(404).json({ message: 'Registo de presença não localizado.' });

    const updated = await prisma.attendance.update({
      where: { id },
      data: { status, note }
    });

    return res.status(200).json({ message: 'Registo atualizado.', data: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao alterar presença.', error });
  }
};

export const publishAttendance = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.schoolId) {
      return res.status(403).json({ error: 'Acesso negado. Escola em falta.' });
    }
    const { schoolId } = req.user;
    const { classid, subjectId, date } = req.body;

    if (!classid || !subjectId || !date) {
      return res.status(400).json({ error: 'Campos classid, subjectId e date são obrigatórios.' });
    }

    await prisma.attendance.updateMany({
      where: {
        classid,
        subjectId,
        date: new Date(date),
        class: { schoolId }
      },
      data: { isPublished: true }
    });

    return res.status(200).json({ message: 'Folha de presença publicada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao publicar presença.', error });
  }
};