const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { LINK_VALID } = require('../constants');

const {
  getAllUsers,
  getOneUser,
  updateUserInformation,
  updateUserAvatar,
  getInfoUser,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getInfoUser);
usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getOneUser);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInformation);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helpers) => {
      if (LINK_VALID.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
  }),
}), updateUserAvatar);

module.exports = usersRouter;
