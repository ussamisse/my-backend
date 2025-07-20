// controllers/statsController.js
const db = require('../db');

exports.getStats = async (req, res) => {
  try {
    const vehicles = await db.query('SELECT COUNT(*) FROM vehicles');
    const drivers = await db.query('SELECT COUNT(*) FROM drivers');
    const infractions = await db.query('SELECT COUNT(*) FROM infractions');

    res.json({
      vehicles: parseInt(vehicles.rows[0].count),
      drivers: parseInt(drivers.rows[0].count),
      infractions: parseInt(infractions.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
