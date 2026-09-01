import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { score, comment, serviceId, applicationId, ticketId } = req.body;
    const rating = await prisma.rating.create({
      data: { score, comment, userId: req.user.id, serviceId, applicationId, ticketId },
    });
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
