require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Mamuskey3700!',
  database: process.env.DB_NAME || 'road_transport',
  port: process.env.DB_PORT || 5432,
});


module.exports = pool;
