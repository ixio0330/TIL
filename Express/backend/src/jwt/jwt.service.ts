import jwt from 'jsonwebtoken';
import SessionExpired from '../error/sessionExpired';
import BadRequest from '../error/badRequest';

class JwtService {
  verifyToken = (token: string | undefined) => {
    if (!token) {
      throw new BadRequest('토큰이 존재하지 않습니다.');
    }
    return this.getPayload(token);
  };

  getAccessToken = (user_id: string) => {
    return jwt.sign({ user_id }, 'SECRET_KEY', {
      expiresIn: '1d',
    });
  };
  
  private getPayload = (token: string) => {
    try {
      return jwt.verify(token, 'SECRET_KEY');
    } catch (error) {
      throw new SessionExpired('유효하지 않은 토큰입니다.');
    }
  };
}

const jwtService = new JwtService();
export default jwtService;