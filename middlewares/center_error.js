const { INTERNAL_SERVER_ERROR, DEFAULT_MESSAGE } = require('../constants');

module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message = DEFAULT_MESSAGE } = err;
  res.status(statusCode).send(
    {
      message: statusCode === INTERNAL_SERVER_ERROR
        ? `err.name = ${err.name} ; err.massage = ${err.message}` : message,
    },
  );
  return next();
};
