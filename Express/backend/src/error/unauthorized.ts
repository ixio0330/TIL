export default class Unauthorized extends Error {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = 'Unauthorized';
  }
}