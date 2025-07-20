const db = require('../db');

exports.getAllVehicles = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM vehicles');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createVehicle = async (req, res) => {
  const { plate_number, model, owner, driver_id} = req.body;
  try {
    const result = await db.query(
      'INSERT INTO vehicles (plate_number, model, owner, driver_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [plate_number, model, owner, driver_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const vehiclesCount = await db.query('SELECT COUNT(*) FROM vehicles');
    const driversCount = await db.query('SELECT COUNT(*) FROM driver');
    const infractionsCount = await db.query('SELECT COUNT(*) FROM infractions');

    res.json({
      vehicles: parseInt(vehiclesCount.rows[0].count),
      drivers: parseInt(driversCount.rows[0].count),
      infractions: parseInt(infractionsCount.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
