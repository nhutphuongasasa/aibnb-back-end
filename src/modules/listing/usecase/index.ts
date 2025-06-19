import { IRepository } from "../../../shared/interface";
import { IListingUseCase } from "../interface";
import { ListingCondDTO, ListingCreateDTO, ListingCreateSchema, ListingResponse, ListingResponseSchema, ListingUserSchema } from "../model/dto";
import { Listing, ListingSchema } from "../model/model";
import { userUseCase } from "../../user/index"
import { AppError } from "../../../shared/model/error";
import prisma from "../../../shared/lib/prismaDB";

export class ListingUseCase implements IListingUseCase{
    constructor(
        private readonly repository: IRepository<Listing, ListingCondDTO>,
    ){}

    async deleteListingMe(UserId: string, id: string): Promise<any> {
        const listingExisting = await prisma.listing.findFirst({
            where: {
                id: id,
                userId: UserId
            },
        })

        if(!listingExisting){
            throw new AppError(404, "listing not found")
        }

        await prisma.listing.delete({
            where: {
                id:id
            }
        })

        const newListing = await prisma.listing.findMany({
            where: {
                userId: UserId
            }
        })

        return newListing
    }

    async getListingMe(userId: string): Promise<any> {
        console.log("okalallaalal")
        const listings = await this.repository.FindListByCond({
            userId: userId
        })

        console.log(userId)

        return listings.map((listing) => {
            return ListingResponseSchema.parse(listing)
        })
    }

    async create(data: ListingCreateDTO): Promise<ListingResponse> {

        const listing = ListingCreateSchema.parse(data);

        const userExisting = await userUseCase().getDetail(listing.userId);

        if(!userExisting){
            throw new AppError(404, "User does not exist")
        }

        const { location, ...rest } = listing

        const newListing: Listing = {
            ...rest,
            locationValue: data.location.value,
            createAt: new Date(),
        }

        const listingCreated = await this.repository.Create(newListing)

        const Host = {
            ...userExisting,
            id: listing.userId
        }

        if (!listingCreated) {
            throw new Error("Failed to create listing");
        }

        const listingResponse: ListingResponse = ListingResponseSchema.parse(listingCreated);
        console.log(Host)
        listingResponse.user = ListingUserSchema.parse(Host);

        return listingResponse;
    }

    async getDetail(id: string): Promise<ListingResponse | null> {
        // console.log("okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
        const listing = await this.repository.GetById(id)

        const listingResponse: ListingResponse = ListingResponseSchema.parse(listing);

        const user = await userUseCase().getDetail(listingResponse.userId)

        const tmp = {
            ...user,
            id: listingResponse.userId
        }

        
        listingResponse.user = ListingUserSchema.parse(tmp)
        console.log(listingResponse)

        return listingResponse;
    }

    async getList(cond: ListingCondDTO): Promise<ListingResponse[] | null> {
        console.log(cond)
        const query: any = Object.entries(cond).reduce((acc: Record<string, any>, [Key, Value]) => {
            if(Value){
                if(["roomCount", "bathroomCount", "guestCount"].includes(Key)){
                    acc[Key] = {
                        gte: +Value
                    }
                }
                else if( ["startDate", "endDate"].includes(Key)){
                    acc.NOT = {
                        reservation: {
                            some: {
                                OR: [
                                    {
                                        endDate: { gte: cond.startDate },
                                        startDate: { lte: cond.startDate }
                                    },
                                    {
                                        startDate: { lte: cond.endDate },
                                        endDate: { gte: cond.endDate }
                                    }
                                ]
                            }
                        }
                    }
                }
                else{
                    acc[Key] = Value;
                }
            }
            return acc;
        },{})

        const listings = await this.repository.FindListByCond(query);

        const listingResponses: ListingResponse[] = await Promise.all(
            listings.map(async listing => {

                const listingResponse: ListingResponse = ListingResponseSchema.parse(listing)
                const user = await userUseCase().getDetail(listingResponse.userId)

                const tmp = {
                    ...user,
                    id: listingResponse.userId,
                }
                // console.log(tmp)
                listingResponse.user = ListingUserSchema.parse(tmp)
                return listingResponse
            })
        )
        // console.log(listingResponses)
        return listingResponses;

    }
}