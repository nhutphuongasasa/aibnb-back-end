// import { NextFunction, Request, Response } from "express";
// import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken'
// import { provideToken } from "./authToken";

// export async function authMiddleware(req: Request, res: Response, next: NextFunction){
//     try {
//         const accessToken = req.cookies.accessToken;
//         const refreshToken = req.cookies.refreshToken;
        
//         if (!accessToken ) {
//             await provideToken(refreshToken)
//         }else if (!refreshToken){
//             return res.status(401).json({ message: "Session expired. Please login again." });
//         }

//         const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
        
//         req.user = user
        
//         next();
//     } catch (err: any) {
//         if (err instanceof TokenExpiredError) {
//             return res.status(401).json({ message: "Token expired" })
//         }
//         if (err instanceof JsonWebTokenError) {
//             return res.status(401).json({ message: "Invalid token" });
//         }
//         return res.status(500).json({ message: err.message })
//     }
// }

import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { provideToken } from "./authToken";

// Tùy chỉnh kiểu Request để thêm user
declare module 'express' {
  interface Request {
    user?: JwtPayload | any;
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      if (!refreshToken) {
        res.status(401).json({ message: "Session expired. Please login again." });
        return;
      }
      // Giả sử provideToken trả về token mới
      const newAccessToken = await provideToken(refreshToken);
      if (newAccessToken) {
        // Cập nhật accessToken (ví dụ: set cookie)
        res.cookie('accessToken', newAccessToken, { httpOnly: true });
      } else {
        res.status(401).json({ message: "Failed to refresh token." });
        return;
      }
    } else if (!refreshToken) {
      res.status(401).json({ message: "Session expired. Please login again." });
      return;
    }

    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    req.user = user;
    next();
  } catch (err: any) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
    } else if (err instanceof JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
}