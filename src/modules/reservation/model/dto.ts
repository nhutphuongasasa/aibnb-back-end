import {z} from "zod"

export const ReservationCreateDTOSchema = z.object({
    userId: z.string(),
    listingId: z.string(),
    startDate:  z.coerce.date(),
    endDate:  z.coerce.date(),
    totalPrice: z.number()
})

export type ReservationCreateDTO = z.infer<typeof ReservationCreateDTOSchema>

export const ReservationResponseSchema = z.object({
    id: z.string(),
    listingId: z.string(),
    startDate:  z.coerce.date().optional(),
    endDate:  z.coerce.date().optional(),
    totalPrice: z.number(),
    createAt:  z.coerce.date(),
    status: z.string(),
    listing: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        imageSrc: z.array(z.string()),
        createAt: z.coerce.date(),
        category: z.string(),
        roomCount: z.number(),
        bathroomCount: z.number(),
        guestCount: z.number(),
        locationValue: z.string(),
        userId: z.string(),
        price: z.number()
    })
})

export type ReservationResponse = z.infer<typeof ReservationResponseSchema>

export const ReservationCondDTOSchema = z.object({
    userId: z.string().optional(),
    listingId: z.string().optional(),
    startDate:  z.coerce.date().optional(),
    endDate:  z.coerce.date().optional(),
    totalPrice: z.number().optional(),
})

export type ReservationCondDTO = z.infer<typeof ReservationCondDTOSchema>




