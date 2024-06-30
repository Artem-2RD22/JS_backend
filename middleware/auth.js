const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret_key';  //секретный ключ

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);  // Если нет токена, не авторизован
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);  // Если токен недействителен, доступ запрещен
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
