const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ValidationError = require('../error/ValidationError');
const NotFoundError = require('../error/NotFoundError');
const ConflictError = require('../error/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

const getUserCurrent = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.message.includes('unique')) {
          return next(new ConflictError(err.message.replace('user validation failed:', 'ошибка при создании пользователя:  ')));
        }
        return next(new ValidationError(err.message.replace('user validation failed:', 'ошибка при создании пользователя:  ')));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.message.includes('unique')) {
          return next(new ConflictError(err.message.replace('Validation failed:', 'ошибка уникальности при обновлении данных пользователя:  ')));
        }
        return next(new ValidationError(err.message));
      }
      return next(err);
    });
};

module.exports = {
  login, getUserCurrent, createUser, updateUser,
};
