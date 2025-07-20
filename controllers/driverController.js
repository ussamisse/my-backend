const db = require('../db');

exports.getAllDrivers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM drivers');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDriver = async (req, res) => {
  const { name, license_number } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO drivers (name, license_number) VALUES ($1, $2) RETURNING *',
      [name, license_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
