const jwt = require('jsonwebtoken');
const SECRET = 'segredo-super-seguro';

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = decoded; // Adiciona as informações do usuário à requisição
    next();
  });
}

module.exports = authenticateToken;
