const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, keys.jwt_secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//check if the user is auth
//if yes go to next
//if not throw an error
