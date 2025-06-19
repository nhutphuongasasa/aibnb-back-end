import { NextFunction, Request, Response } from "express-serve-static-core";
import { BaseHttpService } from "../../../../shared/transport/http-server";
import { IReservationUseCase } from "../../interface";
import { ReservationCondDTO, ReservationCondDTOSchema, ReservationCreateDTO, ReservationResponse } from "../../model/dto";
import { UserCondDTO } from "../../../user/model/dto";
import { AppError } from "../../../../shared/model/error";
import jwt, { JwtPayload } from 'jsonwebtoken'

export class ReservationHttpService extends BaseHttpService<ReservationCreateDTO, ReservationCondDTO, ReservationResponse>{
    constructor(
        readonly usecase: IReservationUseCase
    ){
        super(usecase)
    }

        async getList(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { success, error } = ReservationCondDTOSchema.safeParse(req.query)
            if (!success) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            // console.log(req.query)
            const result = await this.usecase.getList(req.query as ReservationCondDTO);
            console.log(result)
            res.status(200).json({ data: result })
        } catch (error) {
            next(error)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction){
        try {
            const accessToken =  req.cookies.accessToken;
            
            if( ! accessToken ){
                throw new AppError(403,"UnAuthorized")
            }
            
            const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
            
            const userId = user.id

            const result = await this.usecase.deleteReservation(req.params.id, userId)

            res.json(result)
        } catch (error) {
            next(error)
        }
    }
}

