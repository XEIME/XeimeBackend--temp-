import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Role } from '../../generated/prisma/enums';

//List all parents of a school
export const getParents = async (req: Request, res: Response) => {
  try {
    const schoolId = req.user.schoolId;
    const roleParent = Role.PARENT;

    const parentslist = await prisma.user.findMany({
      where: {
        schoolId: schoolId,
        role: roleParent,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        _count: {
          select: {
            children: true,
          },
        },
      },
    });

    return res.json({
      message: `A escola tem um total de ${parentslist.length} Encarregados`,
      parentslist,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Erro ao tentar carregar a lista de Encarregados' });
  }
};

//Get detalhe info of any Parent by Id from prams
export const getParentsDetalhes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res
        .status(400)
        .json({ error: 'ID do encarregado é obrigatório.' });
    }

    const schoolId = req.user.schoolId;
    const roleParent = Role.PARENT;

    const parent = await prisma.user.findFirst({
      where: {
        id: id,
        schoolId: schoolId,
        role: roleParent,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        children: {
          select: {
            name: true,
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
        },
      },
    });

    if (!parent) {
      return res.status(404).json({ error: 'Encarregado não encontrado' });
    }

    return res.json({
      parent,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao tentar carregar os detalhes do encarregado.',
    });
  }
};
