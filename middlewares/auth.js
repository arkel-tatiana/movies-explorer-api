const jwt = require('jsonwebtoken');
const AuthError = require('../error/AuthError');

const auth = (req, res, next) => {// eslint-disable-line
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');

  //  const token = req.cookies.jwt; // все сделала но тесты не проходит
  let payload;
  try {
    payload = jwt.verify(token, 'dev-secret');//  some-secret-key
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
module.exports = { auth };
