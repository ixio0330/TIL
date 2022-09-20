import { Request, Response } from 'express';
import jwtService from './jwt.service';
import { Controller } from '../common/controller.interface';

class JwtController {
  $post_verify: Controller = { 
    path: '/jwt-verify',
    action(req: Request, res: Response) {
      jwtService.verifyToken(req.headers.authorization);
      res.status(200).send('');
    }
  }
}

const jwtController = new JwtController();
export default jwtController;