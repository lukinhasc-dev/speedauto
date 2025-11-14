import { Router } from 'express';
import { getVendas, getVendaById, addVenda, updateVenda, deleteVenda } from '../models/Vendas';

const router = Router();

// Listar todas as vendas
router.get('/', async (req, res) => {
  try {
    const vendas = await getVendas();
    res.json(vendas);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao buscar vendas' });
  }
});

// Buscar venda por ID
router.get('/:id', async (req, res) => {
  try {
    const venda = await getVendaById(Number(req.params.id));
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
    res.json(venda);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao buscar venda' });
  }
});

// Adicionar venda
router.post('/', async (req, res) => {
  try {
    const venda = await addVenda(req.body);
    res.status(201).json(venda);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao adicionar venda' });
  }
});

// Atualizar venda
router.put('/:id', async (req, res) => {
  try {
    const venda = await updateVenda(Number(req.params.id), req.body);
    res.json(venda);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar venda' });
  }
});

// Deletar venda
router.delete('/:id', async (req, res) => {
  try {
    await deleteVenda(Number(req.params.id));
    res.json({ message: 'Venda deletada' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao deletar venda' });
  }
});

export default router;