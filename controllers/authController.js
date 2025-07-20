const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'segredo-super-seguro';

exports.register = async (req, res) => {
  const { username, password } = req.body; // removido role
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, 'user'] // força role = 'user'
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ error: 'User already exists or data invalid' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];

  if (!user) return res.status(401).json({ error: 'User not found' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Incorrect Password' });

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
};
