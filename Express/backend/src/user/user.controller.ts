import { Request, Response } from 'express';
import { Controller } from "../common/controller.interface";
import userService from './user.service';

class UserController {
  $get_id: Controller = {
    path: '/user/:id',
    async action(req: Request, res: Response) {
      const response = await userService.getById(req.params.id);
      res.status(200).send(response);
    }
  };

  $post_register: Controller = {
    path: '/user/register',
    async action(req: Request, res: Response) {
      const response = await userService.create(req.body);
      res.status(200).send(response);
    }
  };

  $post_login: Controller = {
    path: '/user/login',
    async action(req: Request, res: Response) {
      const response = await userService.login(req.body);
      res.status(200).send(response);
    }
  };
}

const userController = new UserController();
export default userController;