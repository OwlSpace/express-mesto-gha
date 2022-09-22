const cardsRouter = require('express').Router();
const {
  getAllCards,
  createNewCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', createNewCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', addLike);
cardsRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardsRouter;
