const http2 = require('node:http2');

const SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_ERROR;
  }
}

module.exports = ServerError;
