import postStorage from "./post.storage";
import { UpdatePostDto, PostDto } from './post.dto';
import * as uuid from 'uuid';

// 유효성, 권한 체크
class PostService {
  create(_post: PostDto) {
    return postStorage.create({
      ..._post,
      user_id: uuid.v1(),
    });
  }

  update(_post: UpdatePostDto) {
    return postStorage.update(_post);
  }

  delete(_id: string) {
    return postStorage.delete(_id);
  }

  getAll() {
    return postStorage.getAll();
  }

  getById(_id: string) {
    return postStorage.getById(_id);
  }
}
const postService = new PostService();
export default postService;
