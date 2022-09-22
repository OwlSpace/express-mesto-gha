const cardModel = require('../models/card');

const getAllCards = (req, res) => {
  cardModel.find({}, {
    name: 1, link: 1, owner: 1, likes: 1, createdAt: 1,
  })
    .then((cards) => {
      if (cards.length === 0) {
        res.status(404).send({ message: 'Карточки отсутствуют' });
      }
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка на сервере: ${err}` });
    });
};

const createNewCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => {
      if (name.length < 2 || name.length > 30) {
        res.status(400).send({ message: 'Не соответствует длина названия карточки' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Некоректные данные: ${err.name}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Такой карточки нет' });
      } else {
        res.status(200).send({ message: 'Карточки отсутствуют' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Передан неправельный id карточки: ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
      }
    });
};

const addLike = (req, res) => {
  cardModel.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Такой карточки нет' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Передан неправельный id карточки: ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
      }
    });
};

const deleteLike = (req, res) => {
  cardModel.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Такой карточки нет' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Передан неправельный id карточки: ${err}` });
      } else {
        res.status(500).send({ message: `Произошла ошибка сервера:  ${err}` });
      }
    });
};

module.exports = {
  getAllCards,
  createNewCard,
  deleteCard,
  addLike,
  deleteLike,
};
