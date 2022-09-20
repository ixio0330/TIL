import { CreatePostDto, UpdatePostDto, PostEntity } from './post.dto';
import * as uuid from 'uuid';
import database from "../db";
import { getToday } from '../utils/time';
import BadGateway from '../error/badGateway';
import BadRequest from '../error/badRequest';

class PostService {
  async create(_post: CreatePostDto) {
    // TODO 유효성 검증
    return await this.insert(_post);
  }

  async update({ id, content, title, user_id }: UpdatePostDto) {
    // TODO 같은 제목, 내용일 경우 db update 하지 않기
    const post = await this.getById(id);
    if (post?.user_id !== user_id) {
      throw new BadRequest('글 작성자만 수정할 수 있습니다.');
    }
    try {
      await database.query(`update posts set title='${title}', content='${content}', updated_on='${getToday()}' where id='${id}'`);
    } catch (error) {
      throw new BadGateway('글을 수정하던 중 오류가 발생했습니다.');
    }
  }

  async delete(_id: string, _user_id: string) {
    const post = await this.getById(_id);
    if (post?.user_id !== _user_id) {
      throw new BadRequest('글 작성자만 삭제할 수 있습니다.');
    }
    try {
      await database.query(`delete from posts where id='${_id}'`);
    } catch (error) {
      throw new BadGateway('글을 삭제하던 중 오류가 발생했습니다.');
    }
  }

  async getAll() {
    const { rows } = await database.query('select * from posts');
    return rows as PostEntity[];
  }

  async getByOffset(_offset: number, _limit?: number) {
    try {
      const { rows } = await database.query(`select * from posts order by created_on desc limit ${_limit || 10} offset ${_offset}`);
      console.log(rows);
      return rows as PostEntity[];
    } catch (error) {
      throw new BadGateway('글을 조회하던 중 오류가 발생했습니다.');
    }
  }

  async getById(_id: string): Promise<PostEntity | undefined> {
    try {
      const find = await database.query(`select * from posts where id='${_id}'`);
      if (!find.rows[0]) {
        throw new BadRequest('존재하지 않는 글입니다.');
      }
      return find.rows[0];
    } catch (error) {
      throw new BadRequest('존재하지 않는 글입니다.');
    }
  }

  private async insert({ user_id, title, content }: CreatePostDto) {
    try {
      const id = uuid.v1();
      await database.query(
        `insert into posts (id, user_id, title, content, created_on) values ('${id}', '${user_id}', '${title}', '${content}', '${getToday()}')`
      );
      return {
        id,
        title,
        content
      };
    } catch (error) {
      throw new BadGateway('서버 내부에서 오류가 발생했습니다.');
    }
  }
}
const postService = new PostService();
export default postService;
