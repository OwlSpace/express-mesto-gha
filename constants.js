const OK = 200;
const ERROR_CODE = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND = 404;
const CONFLICT_ERROR = 409;
const INTERNAL_SERVER_ERROR = 500;
const DEFAULT_MESSAGE = 'Ошибка сервера';

const saltRound = 5;
const SEKRET_KEY = '012345';
const LINK_VALID = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;

module.exports = {
  OK,
  ERROR_CODE,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
  DEFAULT_MESSAGE,
  saltRound,
  SEKRET_KEY,
  LINK_VALID,
};
