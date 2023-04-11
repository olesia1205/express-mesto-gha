const http2 = require('node:http2');

const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFoundError;
