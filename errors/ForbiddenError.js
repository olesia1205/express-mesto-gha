const http2 = require('node:http2');

const FORBIDDEN = http2.constants.HTTP_STATUS_FORBIDDEN;

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
