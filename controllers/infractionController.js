const db = require('../db');

// Listar todas
exports.getAllInfractions = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.id, i.description, i.fine_amount, i.vehicle_id, i.driver_id, i.date,
             v.plate_number
      FROM infractions i
      LEFT JOIN vehicles v ON i.vehicle_id = v.id
      ORDER BY i.date DESC NULLS LAST, i.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar
exports.createInfraction = async (req, res) => {
  const { description, vehicle_id, driver_id, fine_amount } = req.body;
  try {
    // controllers/infractionsController.js
exports.createInfraction = async (req, res) => {
  const { vehicle_id, driver_id, description, fine_amount } = req.body;
  try {
    // validação de existência do veículo (recomendado antes do INSERT)
    const vcheck = await db.query('SELECT id FROM vehicles WHERE id = $1', [vehicle_id]);
    if (vcheck.rows.length === 0) {
      return res.status(400).json({ error: 'Vehicle not found' });
    }

    // inserção
    const result = await db.query(`
      INSERT INTO infractions (vehicle_id, driver_id, description, fine_amount)
      VALUES ($1, $2, $3, $4) RETURNING *`, [vehicle_id, driver_id || null, description, fine_amount || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('CREATE INFRACTION ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// Atualizar
exports.updateInfraction = async (req, res) => {
  const { id } = req.params;
  const { description, vehicle_id, driver_id, fine_amount } = req.body;
  try {
    const result = await db.query(
      `UPDATE infractions SET description=$1, vehicle_id=$2, driver_id=$3, fine_amount=$4
       WHERE id=$5 RETURNING *`,
      [description, vehicle_id, driver_id || null, fine_amount || null, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Infraction not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir
exports.deleteInfraction = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM infractions WHERE id=$1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Infraction not found' });
    res.json({ message: 'Infraction deleted', infraction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
