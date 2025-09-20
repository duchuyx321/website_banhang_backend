import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export type RouteHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<Response | void> | Response | void;

export interface methodRequest extends Request {
    user?: object | JwtPayload | string;
}

export interface dataDecodeJwt extends JwtPayload {
    user_id: string;
    role: string;
}
