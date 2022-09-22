const usersRouter = require('express').Router();
const {
  getAllUsers,
  getOneUser,
  createNewUser,
  updateUserInformation,
  updateUserAvatar
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getOneUser);
usersRouter.post('/', createNewUser);
usersRouter.patch('/me', updateUserInformation);
usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
