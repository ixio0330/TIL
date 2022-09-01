import { PostEntity, CreatePostDto, UpdatePostDto } from './post.dto';
import * as uuid from 'uuid';
import BadRequest from '../error/badRequest';

class PostStorage {
  #posts: PostEntity[] = [{
    id: uuid.v1(),
    user_id: '1',
    title: 'Init title',
    content: 'Init content'
  }];

  create(_post: CreatePostDto) {
    this.#posts.push({
      ..._post,
      id: uuid.v1(),
    });
    return {
      id: uuid.v1(),
      title: _post.title,
      content: _post.content,
    };
  }

  update(_post: any) {
    const find = this.getById(_post.id);
    find.title = _post?.title?.value || _post?.title || find.title;
    find.content = _post?.content?.value || _post?.content || find.content;
    console.log(find);
    return find;
  }

  delete(_id: string) {
    this.#posts = this.#posts.filter((post) => post.id !== _id);
    return true;
  }

  getAll() {
    return this.#posts;
  }

  getById(_id: string) {
    const find = this.#posts.find((post) => post.id === _id);
    if (!find) {
      throw new BadRequest(`존재하지 않는 글입니다.`);
    }
    return find;
  }
}
const postStorage = new PostStorage();
export default postStorage;