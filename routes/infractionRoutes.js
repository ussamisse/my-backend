const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// 🔐 Criar infração - apenas admin
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const { description, vehicle_id, driver_id, fine_amount } = req.body;

  try {
    const vcheck = await db.query('SELECT id FROM vehicles WHERE id = $1', [vehicle_id]);
    if (vcheck.rows.length === 0) {
      return res.status(400).json({ error: 'Vehicle not found' });
    }

    const result = await db.query(
      `INSERT INTO infractions (description, vehicle_id, driver_id, fine_amount)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [description, vehicle_id, driver_id || null, fine_amount || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('CREATE INFRACTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// 📋 Listar todas infrações - apenas usuários autenticados
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.id, i.description, i.fine_amount, i.vehicle_id, i.driver_id, i.date,
             v.plate_number
      FROM infractions i
      LEFT JOIN vehicles v ON i.vehicle_id = v.id
      ORDER BY i.date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('FETCH INFRACTIONS ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
