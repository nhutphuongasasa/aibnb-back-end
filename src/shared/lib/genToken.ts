import { sign } from "jsonwebtoken";
import jwt from "jsonwebtoken";

function generateAccessToken(user: any) {
    const jwt = sign({
        id: user.id,
        name: user.name,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET as string,{
        expiresIn: '15m'
    })

    return jwt;
}

function generateRefreshToken( user: any){
    const jwt = sign({
        id: user.id,
        // name: user.name,
        // email: user.name
    }, process.env.REFRESH_TOKEN_SECRET as string,{
        expiresIn: '7d'
    })

    return jwt
}

function generateAccessTokenFromRefreshToken(refreshToken: string) {
    if (!refreshToken) {
        return false
    }
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;

    return generateAccessToken(user);
}

export { generateAccessToken, generateRefreshToken, generateAccessTokenFromRefreshToken };
