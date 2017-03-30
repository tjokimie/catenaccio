const { ValidationError } = require('mongoose').Error
const NotFoundError = require('./errors/NotFoundError');

module.exports = function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(400).end();
  } else if (err instanceof NotFoundError) {
    res.status(404).end();
  } else {
    console.error(err);
    res.status(500).end();
  }
};
