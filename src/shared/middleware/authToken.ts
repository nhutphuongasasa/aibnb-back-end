import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import prisma from '../lib/prismaDB';
import { generateAccessToken } from '../lib/genToken';
import { AppError } from '../model/error';

export async function provideToken(refreshToken: string){
    try {
        if(!refreshToken){
            // throw new Error("Refresh token is required");
            throw new AppError(400, "Refresh token is required")
        }
        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as any;
        const userExisting = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        });
        if (!userExisting) {
            // throw new Error("No have any user")
            throw new AppError(400, "No have any user")
        }
        return generateAccessToken(userExisting)
    } catch (error) {
        // if (error instanceof TokenExpiredError) {
        //     throw new Error("Refresh token has expired");
        // }
        // if (error instanceof JsonWebTokenError) {
        //     throw new Error("Invalid refresh token");
        // }
        // throw new Error("Error verifying refresh token");
        throw new AppError(500, "Error verifying refresh token", error)
    }
}