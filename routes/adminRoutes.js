// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// Protege todas as rotas seguintes
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// Listar usuários
router.get('/users', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, role FROM users ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Promover usuário
router.patch('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role inválido' });
  }
  try {
    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role',
      [role, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
