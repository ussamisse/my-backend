const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');
const db = require('../db');

// 🔒 Apenas admin pode registrar veículos
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { plate_number, model, owner, driver_id} = req.body;
  try {
    const result = await db.query(
      'INSERT INTO vehicles (plate_number, model, owner, driver_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [plate_number, model, owner, driver_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
  console.error(err); // mostra o erro completo no console do backend
  res.status(400).json({ error: err.message || 'erro ao registrar veiculo' });
}
});

// Listar todos os veículos (qualquer usuário autenticado)
router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query('SELECT * FROM vehicles');
  res.json(result.rows);
});
// DELETE /vehicles/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  const vehicleId = parseInt(req.params.id);

  try {
    const result = await db.query(
      'DELETE FROM vehicles WHERE id = $1 RETURNING *',
      [vehicleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Veículo não encontrado.' });
    }

    res.status(200).json({ message: 'Veículo excluído com sucesso.', vehicle: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir veículo.', error: err.message });
  }
});

// Atualizar veículo — apenas admin
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const vehicleId = parseInt(req.params.id);
  const { plate_number, model, owner, driver_id } = req.body;
  try {
    const result = await db.query(
      `UPDATE vehicles
       SET plate_number = $1, model = $2, owner = $3, driver_id = $4
       WHERE id = $5
       RETURNING *`,
      [plate_number, model, owner, driver_id, vehicleId]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
