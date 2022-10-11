const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { OK, SEKRET_KEY, saltRound } = require('../constants');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getAllUsers = (req, res, next) => {
  userModel.find({}, { name: 1, about: 1, avatar: 1 })
    .then((users) => {
      res.status(OK).send(users);
    })
    .catch(next);
};

const getOneUser = (req, res, next) => {
  userModel.findById(req.params.id, { name: 1, about: 1, avatar: 1 })
    .orFail(() => {
      throw new NotFoundError('Такого пользователя не существует');
    })
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан неправельный id пользователя'));
      }
      return next(err);
    });
};

const createNewUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, saltRound)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некоректные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email-адресом уже существует'));
      }
      return next(err);
    });
};

const updateUserInformation = (req, res, next) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { returnDocument: 'after', runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некоректные данные'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after', runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некоректные данные'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SEKRET_KEY, { expiresIn: '7d' });
      res.cookie('authorization', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильная почта или пароль'));
    });
};

const getInfoUser = (req, res, next) => {
  console.log(req.res.user._id );
  userModel.findById(req.res.user._id)
    .then((user) => {

      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(OK).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateUserInformation,
  updateUserAvatar,
  login,
  getInfoUser,
};
