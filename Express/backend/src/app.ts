import express, { Response, Request, NextFunction } from "express";
import postController from "./post/post.controller";
import jwtController from "./jwt/jwt.controller";
import helmet from 'helmet';
import compression from 'compression';
import requestIp from 'request-ip';
import logger from "./logs/logger";
import cors from 'cors';
import userController from "./user/user.controller";
// 비동기 에러 처리
import 'express-async-errors';
import { tokenVerfiy } from "./middleware/tokenVerify";
import MethodNotAllowed from "./error/methodNotAllowed";

const app = express();
const port = 9000;

// SOP (cors 설정)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
}));
app.use(express.json());
app.use(helmet());
// 압축
app.use(compression());

// Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request ${req.url}`, {
    ip: requestIp.getClientIp(req),
    time: new Date().toLocaleString(),
  });
  next();
});

app.listen(port, '0.0.0.0', () => {
  logger.info(`Server : http://localhost:${port}`);
});

app.get('/', (req, res) => {
  setTimeout(() => {
    res.send({ message: 'Hello Express!' });
  }, 3000);
});

// post
app.get(postController.$get.path, postController.$get.action);
app.get(postController.$get_id.path, postController.$get_id.action);
app.post(postController.$post.path, tokenVerfiy, postController.$post.action);
app.put(postController.$put.path, tokenVerfiy, postController.$put.action);
app.delete(postController.$delete.path, tokenVerfiy, postController.$delete.action);

// jwt
app.post(jwtController.$post_verify.path, jwtController.$post_verify.action);

// users
app.get(userController.$get_id.path, userController.$get_id.action);
app.post(userController.$post_register.path, userController.$post_register.action);
app.post(userController.$post_login.path, userController.$post_login.action);

// 예외처리
app.all('*', () => {
  throw new MethodNotAllowed('잘못된 요청입니다.');
});

// Error 처리는 맨 밑에 선언해야 한다.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res
    .status(err?.status || 500)
    .send(
      {
        name: err?.name || 'Internal Server Error',
        message: err?.message || 'Internal Server Error'
      }
    );
});