const mongoose = require('mongoose');
const { bcrypt } = require('bcryptjs');
const isEmaill = require('validator/lib/isEmaill');
const { LINK_VALID } = require('../constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => LINK_VALID.test(v),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isEmaill(v),
      message: 'неправильный формат пачты',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    selector: false,
  },
});

userSchema.static.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matches) => {
          if (!matches){
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'))
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
