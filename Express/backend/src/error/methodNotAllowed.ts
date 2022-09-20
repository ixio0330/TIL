export default class MethodNotAllowed extends Error {
  status = 405;
  constructor(message: string) {
    super(message);
    this.name = 'Method Not Allowed';
  }
}