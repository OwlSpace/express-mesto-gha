const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routers/users');
const cardsRouter = require('./routers/cards');
const bodyParser = require('body-parser');

const {PORT = 3000} = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use(bodyParser.json());


app.use((req, res, next) => {
  req.user = {
    _id: '6329f7c098df4a0ed46dd3b5'
  };
  next();
});


app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});