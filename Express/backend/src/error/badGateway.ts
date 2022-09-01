export default class BadGateway extends Error {
  status = 500;
  constructor(message: string) {
    super(message);
    this.name = 'BadGateway';
  }
}