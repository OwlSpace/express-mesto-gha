const userModel = require('../models/user');

const getAllUsers = (req, res) => {
  userModel.find({}, { name: 1, about: 1, avatar: 1 })
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: 'Пользователи не найдены' });
      }
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
    });
};

const getOneUser = (req, res) => {
  userModel.findById(req.params.id, { name: 1, about: 1, avatar: 1 })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Такого пользователя не существует' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Передан неправельный id пользователя: ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
      }
    });
};

const createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Некоректные данные: ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
      }
    });
};

const updateUserInformation = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { returnDocument: 'after', runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Некоректные данные: ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after' })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Некоректные данные: ${err.name}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
      }
    });
};

module.exports = {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateUserInformation,
  updateUserAvatar,
};
