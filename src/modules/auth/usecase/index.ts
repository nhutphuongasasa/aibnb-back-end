import { IAuthUseCase } from "../interface";
import { userUseCase } from '../../user/index'
// import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import { LoginResponse, LoginResponseSchema } from "../model/dto";
import prisma from "../../../shared/lib/prismaDB";
import { AppError } from "../../../shared/model/error";

export class AuthUseCase implements IAuthUseCase{

    async Login(email: string, password: string): Promise<any> {
        const userExisting = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(!userExisting){
            throw new AppError(404,"User not found")
        }

        const isTrue = bcrypt.compareSync(password, userExisting.hashedPassword!)

        if(!isTrue){
            throw new AppError(500, "Email or password is incorrect")
        }
        console.log("login")
        console.log(userExisting)

        return LoginResponseSchema.parse(userExisting)
    }

    async Register(name: string, password: string, email: string): Promise<LoginResponse> {
        const user = await userUseCase().create({
            name: name,
            email: email,
            password: password
        })
        console.log(email)
        return LoginResponseSchema.parse(user)
    }
}