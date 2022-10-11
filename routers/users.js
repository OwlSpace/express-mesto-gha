const usersRouter = require('express').Router();
const {
  getAllUsers,
  getOneUser,
  updateUserInformation,
  updateUserAvatar,
  getInfoUser,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getInfoUser);
usersRouter.get('/:id', getOneUser);
usersRouter.patch('/me', updateUserInformation);
usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
