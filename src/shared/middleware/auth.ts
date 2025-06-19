import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction){
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        
        if (!accessToken ) {
            return res.status(401).json({ message: "have no token"})
        }else if (!refreshToken){
            return res.status(401).json({ message: "Session expired. Please login again." });
        }

        const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as any;
        
        req.user = user
        
        next();
    } catch (err: any) {
        if (err instanceof TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" })
        }
        if (err instanceof JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: err.message })
    }
}