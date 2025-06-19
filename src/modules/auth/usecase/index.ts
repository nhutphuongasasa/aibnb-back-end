import { IAuthUseCase } from "../interface";
import { userUseCase } from '../../user/index'
// import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import { LoginResponse, LoginResponseSchema } from "../model/dto";

export class AuthUseCase implements IAuthUseCase{

    async Login(email: string, password: string): Promise<any> {
        const userExisting = await userUseCase().getByEmail(email)

        const isTrue = bcrypt.compareSync(password, userExisting.hashedPassword)

        if(isTrue){
            return {
                statusCode: 500,
                message: "Email or password is incorrect"
            }
        }

        return LoginResponseSchema.parse(userExisting)
    }

    async Register(name: string, password: string, email: string): Promise<LoginResponse> {
        const user = await userUseCase().create({
            name: name,
            email: email,
            password: password
        })

        return LoginResponseSchema.parse(user)
    }
}