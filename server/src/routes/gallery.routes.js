import { Router } from 'express';
import prisma from '../prisma.js';

const router = Router();

// GET all published gallery items
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { isPublished: true };
    if (category && category !== 'ALL') {
      where.category = String(category);
    }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    res.json({ gallery: items, count: items.length });
  } catch (error) {
    next(error);
  }
});

export default router;
