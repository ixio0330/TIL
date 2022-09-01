export default class Conflict extends Error {
  status = 409;
  constructor(message: string) {
    super(message);
    this.name = 'Conflict';
  }
}