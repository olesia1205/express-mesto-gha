const http2 = require('node:http2');

const CONFLICT = http2.constants.HTTP_STATUS_CONFLICT;

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;
