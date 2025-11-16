import { Router } from 'express';
import { getDashboardStats } from '../models/DashboardModel';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao buscar estatísticas do dashboard' });
  }
});

export default router;