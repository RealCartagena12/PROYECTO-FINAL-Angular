const jwt = require('jsonwebtoken');


function authRequired(req, res, next) {
  const header = req.headers.authorization || req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Token de autenticación inválido o expirado' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
  }
  next();
}

module.exports = { authRequired, adminOnly };
