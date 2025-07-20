const db = require('./db');

db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Falha na conexão com o banco de dados:', err.message);
  } else {
    console.log('✅ Banco de dados conectado com sucesso:', res.rows[0]);
  }
  process.exit();
});
