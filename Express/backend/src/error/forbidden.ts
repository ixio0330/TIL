export default class Forbidden extends Error {
  status = 401;
  constructor(message: string) {
    super(message);
    this.name = 'Forbidden';
  }
}