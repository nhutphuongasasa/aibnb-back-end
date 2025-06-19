import { IRepository, IUseCase } from "../../../shared/interface";
import prisma from "../../../shared/lib/prismaDB";
import { AppError } from "../../../shared/model/error";
import { IListingUseCase } from "../../listing/interface";
import { IUserUseCase } from "../../user/interface";
import { IReservationUseCase } from "../interface";
import { ReservationCondDTO, ReservationCreateDTO, ReservationResponse, ReservationResponseSchema } from "../model/dto";
import { Reservation, ReservationSchema } from "../model/model";


export class ReservationUseCase implements IReservationUseCase{
    constructor(
        private readonly listingUseCase: IListingUseCase,
        private readonly userUseCase: IUserUseCase,
        private readonly repository: IRepository<Reservation, ReservationCondDTO>
    ){}

    async deleteReservation(id: string, userId: string): Promise<any> {
        console.log(id)
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            throw new AppError(404, "user not found")
        }

        const reservationExisting = await prisma.reservation.findUnique({
            where: {
                id: id
            }
        })

        if( !reservationExisting){
            throw new AppError(404, "Reservation not found")
        }

        if(reservationExisting.userId != userId){
            throw new AppError(400, "Bad request")
        }

        await prisma.reservation.delete({
            where: {
                id
            }
        })

        return "successful"
    }

    async create(data: ReservationCreateDTO): Promise<any> {
        console.log("create reservation")
        const reservation: Reservation = ReservationSchema.parse(data)

        const userExisting = await this.userUseCase.getDetail(reservation.userId)

        if(!userExisting){
            throw new AppError(404, "User not found")
        }

        const listingExisting = await this.listingUseCase.getDetail(reservation.listingId)

        if(!listingExisting){
            throw new AppError(404, "Listing not found")
        }

        // const listingAndReservation = await prisma.listing.update({
        //     where: {
        //         id: reservation.listingId
        //     },
        //     data: {
        //         reservations: {
        //             create: {
        //                 userId: reservation.userId,
        //                 startDate: reservation.startDate,
        //                 endDate: reservation.endDate,
        //                 totalPrice: reservation.totalPrice
        //               }
        //         }
        //     }
        // })

        const newReservation = await prisma.reservation.create({
            data: {
              user: {
                connect: {
                  id: reservation.userId
                }
              },
              listing: {
                connect: {
                  id: reservation.listingId
                }
              },
              startDate: reservation.startDate,
              endDate: reservation.endDate,
              totalPrice: reservation.totalPrice,
            }
          });
          

        return newReservation
    }

    async getList(cond: ReservationCondDTO): Promise<ReservationResponse[] | null> {
        console.log("getlis reservation")
        let query: any = Object.entries(cond).reduce((acc: Record<string, any>, [Key, Value]) => {
            if(Value){
                if(['startDate', 'endDate'].includes(Key)){
                    acc = {
                        some: {
                            startDate: { gte: cond.startDate },
                            endDate: { lte: cond.endDate }
                        }
                    }
                }
                else{
                    acc[Key] = cond.listingId
                }
            }
            return acc
        },{})

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true
            },
            orderBy: {
                createAt: 'desc'
            }
        })

        return await Promise.all(
            reservations.map(async (reservation) => {
                const tmp = {
                    ...reservation,
                    createAt: reservation.createAt.toISOString(),
                    startDate: reservation.startDate.toISOString(),
                    endAt: reservation.endDate.toISOString(),
                    listing: {
                        ...reservation.listing,
                        createAt: reservation.createAt.toISOString(),
                    }
                }

                const reservationResponse: ReservationResponse = ReservationResponseSchema.parse(reservation)
                return reservationResponse
            })
        )
    }

    async getDetail(id: string): Promise<ReservationResponse> {
        const reservation: Reservation | null = await this.repository.GetById(id)

        if(!reservation){
            throw new AppError(404, "Reservation not found")
        }

        return ReservationResponseSchema.parse(reservation)
    }
}