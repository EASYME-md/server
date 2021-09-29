const createError = require('http-errors');

function invalidUrlError(req, res, next) {
  next(createError(404));
}

module.exports = invalidUrlError;
