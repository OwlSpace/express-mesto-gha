const cardModel = require('../models/card');

const OK = 200;
const ERROR_CODE = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const getAllCards = (req, res) => {
  cardModel.find({}, {
    name: 1, link: 1, owner: 1, likes: 1, createdAt: 1,
  })
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

const createNewCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некоректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Такой карточки нет' });
      } else {
        res.status(OK).send({ message: 'Карточки отсутствуют' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан неправельный id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const addLike = (req, res) => {
  cardModel.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Такой карточки нет' });
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан неправельный id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const deleteLike = (req, res) => {
  cardModel.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Такой карточки нет' });
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан неправельный id карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
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
