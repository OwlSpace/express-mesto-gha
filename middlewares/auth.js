const jwt = require('jsonwebtoken');
const { SEKRET_KEY } = require('../constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(authorization, SEKRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  res.user = payload;
  return next();
};
