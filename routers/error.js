const errorRouter = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

errorRouter.all('/', (req, res, next) => next(new NotFoundError('неправильный путь')));

module.exports = errorRouter;
