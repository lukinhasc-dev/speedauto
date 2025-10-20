import { Router } from 'express';
import { getClientes, getClienteById, addCliente, updateCliente, deleteCliente } from '../models/Clientes';

const router = Router();

// Listar todos os clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await getClientes();
    res.json(clientes);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao buscar clientes' });
  }
});

// Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await getClienteById(Number(req.params.id));
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao buscar cliente' });
  }
});

// Adicionar cliente
router.post('/', async (req, res) => {
  try {
    const cliente = await addCliente(req.body);
    res.status(201).json(cliente);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao adicionar cliente' });
  }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const cliente = await updateCliente(Number(req.params.id), req.body);
    res.json(cliente);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao atualizar cliente' });
  }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
  try {
    await deleteCliente(Number(req.params.id));
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erro ao deletar cliente' });
  }
});

export default router;
