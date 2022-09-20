import { RequestHandler } from 'express';
export interface Controller {
  path: string;
  action: RequestHandler;
}