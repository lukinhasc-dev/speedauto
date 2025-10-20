import { Router } from 'express';
import { getVeiculos, getVeiculoById, addVeiculo, updateVeiculo, deleteVeiculo } from '../models/Veiculos';

const router = Router();

// Listar todos os veículos
router.get('/', async (req, res) => {
  try {
    const veiculos = await getVeiculos();
    res.json(veiculos);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao buscar veículos' });
  }
});

// Buscar veículo por ID
router.get('/:id', async (req, res) => {
  try {
    const veiculo = await getVeiculoById(Number(req.params.id));
    if (!veiculo) return res.status(404).json({ error: 'Veículo não encontrado' });
    res.json(veiculo);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao buscar veículo' });
  }
});

// Adicionar veículo
router.post('/', async (req, res) => {
  try {
    const veiculo = await addVeiculo(req.body);
    res.status(201).json(veiculo);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao adicionar veículo' });
  }
});

// Atualizar veículo
router.put('/:id', async (req, res) => {
  try {
    const veiculo = await updateVeiculo(Number(req.params.id), req.body);
    res.json(veiculo);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar veículo' });
  }
});

// Deletar veículo
router.delete('/:id', async (req, res) => {
  try {
    await deleteVeiculo(Number(req.params.id));
    res.json({ message: 'Veículo deletado' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao deletar veículo' });
  }
});

export default router;
