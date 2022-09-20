import postService from "./post.service";
import { UpdatePostDto, CreatePostDto } from './post.dto';
import { Request, Response } from 'express';
import { Controller } from "../common/controller.interface";
import BadRequest from "../error/badRequest";

class PostController {
  $get: Controller = {
    path: '/post',
    async action(req: Request, res: Response) {
      if (req.query.offset) {
        const offset = parseInt(req.query.offset as string);
        if (Object.is(NaN, offset)) {
          throw new BadRequest('offset이 올바르지 않습니다.');
        }
        const response = await postService.getByOffset(offset);
        res.status(200).send(response);
        return;
      } 
      const response = await postService.getAll();
      res.status(200).send(response);
    }
  }

  $get_id: Controller = {
    path: '/post/:id',
    async action(req: Request, res: Response) {
      const response = await postService.getById(req.params.id as string);
      res.status(200).send(response);
    }
  }

  $post: Controller = {
    path: '/post',
    async action(req: Request, res: Response) {
      const response = await postService.create(req.body as CreatePostDto);
      res.status(200).send(response);
    }
  }

  $put: Controller = {
    path: '/post',
    async action(req: Request, res: Response) {
      const response = await postService.update(req.body as UpdatePostDto);
      res.status(200).send(response);
    }
  }

  $delete: Controller = {
    path: '/post',
    async action(req: Request, res: Response) {
      const response = await postService.delete(req.query.id as string, req.body.id);
      res.status(200).send(response);
    }
  }
}
const postController = new PostController();
export default postController;
