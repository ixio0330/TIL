import express, { Response, Request, NextFunction } from "express";
import postController from "./post/post.controller";
import helmet from 'helmet';
import compression from 'compression';
import requestIp from 'request-ip';
import logger from "./logs/logger";
import cors from 'cors';

const app = express();
const port = 9000;

app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(helmet());
app.use(compression());

// Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(new Date().toLocaleString());
  logger.info('Request ip', {
    ip: requestIp.getClientIp(req),
    time: new Date().toLocaleString(),
  });
  next();
});

app.listen(port, '0.0.0.0', () => {
  logger.info(`Server : http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/post', postController.getAll);
app.get('/post/:id', postController.getById);
app.post('/post', postController.create);
app.put('/post', postController.update);
app.delete('/post', postController.delete);

// Error 처리는 맨 밑에 선언해야 한다.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err?.message, {
    status: err?.status || 500,
    name: err.name,
    message: err.message,
  });
  res
    .status(err?.status || 500)
    .send(
      {
        name: err.name,
        message: err.message
      }
    );
});