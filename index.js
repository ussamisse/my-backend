const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const authMiddleware = require('./middleware/authMiddleware');
const authenticateToken = require('./middleware/authenticateToken');
const authorizeRole = require('./middleware/authorizeRole');
const adminRoutes = require('./routes/adminRoutes');

const driverRoutes = require('./routes/driversRoutes');
const infractionRoutes = require('./routes/infractionRoutes');
const statsRoutes = require('./routes/statsRoutes');


require('dotenv').config();
const vehicleRoutes = require('./routes/vehiclesRoutes');


const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/drivers', driverRoutes);
app.use('/infractions', infractionRoutes);
app.use('/vehicles', authMiddleware, vehicleRoutes);
app.use('/stats', statsRoutes);
app.use('/admin', adminRoutes);



app.get('/', (req, res) => {
  res.send('API Road Transport is running 🚦');
});

// 🚨 Admin: precisa de autenticação e autorização
app.use(
  '/admin',
  authenticateToken,
  authorizeRole('admin'),
  adminRoutes
);


app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});