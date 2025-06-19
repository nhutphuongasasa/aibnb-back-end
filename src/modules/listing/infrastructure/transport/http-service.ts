import { NextFunction ,Response, Request } from "express";
import { BaseHttpService } from "../../../../shared/transport/http-server";
import { IListingUseCase } from "../../interface";
import { ListingCondDTO, ListingCondDTOSchema, ListingCreateDTO, ListingResponse } from "../../model/dto";
import { AppError } from "../../../../shared/model/error";
import jwt, { JwtPayload } from 'jsonwebtoken'

export class ListingHttpService extends BaseHttpService<ListingCreateDTO, ListingCondDTO, ListingResponse>{
    constructor(
        readonly usecase: IListingUseCase
    ){
        super(usecase);
    }

    async deleteListing(req: Request, Res: Response, next: NextFunction){
        try {
            console.log("delete listing")
            const accessToken = req.cookies.accessToken
    
            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
            
            const listingId = req.params.id

            const result = this.usecase.deleteListingMe(user.id, listingId)
            console.log("complete delete")
            console.log(result)
            Res.json({
                date: result
            })
        } catch (error) {
            next(error)
        }
    }

    async getListMe(req: Request, res: Response, next: NextFunction): Promise<any> {
        console.log("get listing me")
        try {
            const accessToken = req.cookies.accessToken

            if( ! accessToken ){
                throw new AppError(403,"UnAuthorized")
            }

            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
            console.log(user.id)
            const result = await this.usecase.getListingMe(user.id)
            console.log("me")
            console.log(result)
            res.json({data: result})

        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken =  req.cookies.accessToken;

            if( ! accessToken ){
                throw new AppError(403,"UnAuthorized")
            }

            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload

            req.body.userId = user.id
            req.body.price = Number(req.body.price)
            console.log(req.body)
            const result = await this.usecase.create(req.body);
            res.status(201).json({ data: result});
        } catch (error) {
            next(error)
        }
    }

    
    async getList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { success, error } = ListingCondDTOSchema.safeParse(req.query)
            if (!success) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            const result = await this.usecase.getList(req.query as ListingCondDTO);

            res.status(200).json({ data: result })
        } catch (error) {
            next(error)
        }
    }
}