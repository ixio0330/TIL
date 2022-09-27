module.exports = class NotFound extends Error {
  status = 404;
  constructor(message) {
    super(message);
  }
}