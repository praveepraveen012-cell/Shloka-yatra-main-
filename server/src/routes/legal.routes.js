import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET all legal documents
router.get('/', async (req, res, next) => {
  try {
    const documents = await prisma.legalDocument.findMany({
      orderBy: { slug: 'asc' },
    });
    res.json({ documents });
  } catch (error) {
    next(error);
  }
});

// GET single legal document by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const document = await prisma.legalDocument.findUnique({
      where: { slug },
    });

    if (!document) {
      return res.status(404).json({ error: `Legal document '${slug}' not found` });
    }

    res.json({ document });
  } catch (error) {
    next(error);
  }
});

export default router;
