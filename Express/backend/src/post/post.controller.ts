import postService from "./post.service";
import { UpdatePostDto, PostDto } from './post.dto';
import { Request, Response } from 'express';

class PostController {
  create(req: Request, res: Response) {
    const response = postService.create(req.body as PostDto);
    res.status(200).send(response);
  }

  update(req: Request, res: Response) {
    const response = postService.update(req.body as UpdatePostDto);
    res.status(200).send(response);
  }

  delete(req: Request, res: Response) {
    const response = postService.delete(req.query.id as string);
    res.status(200).send(response);
  }

  getAll(req: Request, res: Response) {
    const response = postService.getAll();
    res.status(200).send(response);
  }

  getById(req: Request, res: Response) {
    const response = postService.getById(req.params.id as string);
    res.status(200).send(response);
  }
}
const postController = new PostController();
export default postController;
