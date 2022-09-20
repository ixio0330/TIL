import BadRequest from "../error/badRequest";
import BadGateway from '../error/badGateway';
import { CreateUserDto, LoginDto, UserEntity } from "./user.dto";
import database from "../db";
import { createHashedPassword, verifyPassword } from '../crypto';
import jwtService from "../jwt/jwt.service";

class UserService {
  async login({ id, password }: LoginDto) {
    const user = await this.getById(id);
    if (!await verifyPassword({ hashPassword: user.password, salt: user.salt, password })) {
      throw new BadRequest('아이디 혹은 비밀번호가 일치하지 않습니다.');
    }
    return {
      token: jwtService.getAccessToken(id),
    }
  }

  async create(_user: CreateUserDto) {
    if (await this.findById(_user.id)) {
      throw new BadRequest('이미 존재하는 아이디입니다.');
    }
    return await this.insert(_user);
  }

  async getById(_id: string) {
    const user = await this.findById(_id);
    if (!user) {
      throw new BadRequest('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  private async findById(_id: string): Promise<UserEntity | null> {
    try { 
      const find = await database.query(`select * from users where id='${_id}';`);
      return find.rows[0];
    } catch (error) {
      return null;
    }
  }

  private async insert({ id, name, nickname, email, password, role }: CreateUserDto) {
    const { salt, hashPassword } = await createHashedPassword(password);
    try {
      await database.query(
        `insert into users (id, name, nickname, email, password, role, salt) values ('${id}', '${name}', '${nickname}', '${email}', '${hashPassword}', '${role}', '${salt}')`
      );
      return {
        id,
        name,
        nickname,
        email
      }
    } catch (error) {
      throw new BadGateway('서버 내부에서 오류가 발생했습니다.');
    }
  }
}

const userService = new UserService();
export default userService;