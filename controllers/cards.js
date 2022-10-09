const cardModel = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { OK } = require('../constants');

const getAllCards = (req, res, next) => {
  cardModel.find({}, {
    name: 1, link: 1, owner: 1, likes: 1, createdAt: 1,
  })
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch(next);
};

const createNewCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel.create({ name, link, owner })
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('400 - Некоректные данные'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  cardModel.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ForbiddenError('Такой карточки нет');
      } else if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить не свою карточку');
      }
      return card.remove().then(() => res.status(OK).send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан неправельный id карточки'));
      }
      return next(err);
    });
};

const addLike = (req, res, next) => {
  cardModel.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан неправельный id карточки'));
      }
      return next(err);
    });
};

const deleteLike = (req, res, next) => {
  cardModel.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан неправельный id карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getAllCards,
  createNewCard,
  deleteCard,
  addLike,
  deleteLike,
};
