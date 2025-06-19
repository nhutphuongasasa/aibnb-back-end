import { NextFunction, Request, Response } from "express";
import { BaseHttpService } from "../../../../shared/transport/http-server";
import { IUserUseCase } from "../../interface";
import { UserCondDTO, UserCreateDTO, UserResponse } from "../../model/dto";
import { AppError } from "../../../../shared/model/error";
import jwt, { JwtPayload } from 'jsonwebtoken'

export class UserHttpService extends BaseHttpService<UserCreateDTO, UserCondDTO, UserResponse>{
    constructor(
        readonly usecase: IUserUseCase
    ){
        super(usecase);
    }

    async getFavoriteListing(req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
            const accessToken = req.cookies.accessToken

            if(!accessToken){
                throw new AppError(403, "UnAuthorized")
            }

            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload

            const userId = user.id

            const result = await this.usecase.getFavorite(userId)

            console.log(result)

            return res.json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    async removeDavoriteListing(req: Request, res: Response, next: NextFunction){
        try {
            const accessToken = req.cookies.accessToken

            if(!accessToken){
                throw new AppError(403, "UnAuthorized")
            }

            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload

            const userId = user.id

            const listingId = req.params.id

            const result = await this.usecase.removeFavoriteListing(listingId, userId)
            console.log(result)

            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async addFavoriteListing(req: Request, res: Response, next: NextFunction){
        try {
            const accessToken = req.cookies.accessToken

            if(!accessToken){
                throw new AppError(403, "UnAuthorized")
            }

            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload

            const userId = user.id

            const listingId = req.params.id
            // console.log(req.params.listingId)

            const result = await this.usecase.addFavoriteListing(listingId, userId)

            console.log(result)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    async getDetail(req: any, res: any, next: NextFunction): Promise<void> {
        try {
            // const userId = req.body.i;
            const accessToken = req.cookies.accessToken

            if(!accessToken){
                throw new AppError(403, "UnAuthorized")
            }

            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload

            const userId = user.id
            const userExisting = await this.usecase.getDetail(userId);
            res.status(200).json({ data: userExisting });
        } catch (error) {
            next(error)
        }
    }
}