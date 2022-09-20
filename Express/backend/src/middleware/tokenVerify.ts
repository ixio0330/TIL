import jwtService from "../jwt/jwt.service";
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from "jsonwebtoken";

export function tokenVerfiy(req: Request, res: Response, next: NextFunction) {
  const payload = jwtService.verifyToken(req.headers.authorization) as JwtPayload;
  req.body.user_id = payload.user_id;
  next();
}