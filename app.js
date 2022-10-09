const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routers/users');
const cardsRouter = require('./routers/cards');
const errorRouter = require('./routers/error');
const {
  login,
  createNewUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const center_error = require('./middlewares/center_error');
const { LINK_VALID } = require('./constants');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((v) => LINK_VALID.test(v)),
  })
}), createNewUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', errorRouter);

app.use(errors());
app.use(center_error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
