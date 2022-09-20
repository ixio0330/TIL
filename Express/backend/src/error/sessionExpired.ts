export default class SessionExpired extends Error {
  status = 419;
  constructor(message: string) {
    super(message);
    this.name = 'Session Expired';
  }
}