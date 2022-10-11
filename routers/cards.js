const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { LINK_VALID } = require('../constants');

const {
  getAllCards,
  createNewCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().min(2).custom((value, helpers) => {
      if (LINK_VALID.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
  })
}), createNewCard);
cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCard);
cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), addLike);
cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteLike);

module.exports = cardsRouter;
