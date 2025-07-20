const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");
const db = require("../db");

// GET /drivers – todos os motoristas
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM drivers ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /drivers – criar novo (apenas admin)
router.post("/", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { name, license_number } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO drivers (name, license_number) VALUES ($1, $2) RETURNING *",
      [name, license_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /drivers/:id – deletar motorista (admin)
router.delete("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query(
      "DELETE FROM drivers WHERE id = $1 RETURNING *", [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Driver not found" });
    res.json({ message: "Driver deleted", driver: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /drivers/:id – editar motorista (admin)
router.put("/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, license_number } = req.body;
  try {
    const result = await db.query(
      "UPDATE drivers SET name = $1, license_number = $2 WHERE id = $3 RETURNING *",
      [name, license_number, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Driver not found" });
    res.json({ message: "Driver updated", driver: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
