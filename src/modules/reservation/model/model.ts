import {z} from 'zod'

export const ReservationSchema = z.object({
    id: z.string().optional(),
    userId: z.string({ required_error: "userId is required"}),
    listingId: z.string({ required_error: "listingId is required"}),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    totalPrice: z.number({ required_error: "totalPrice is required"}),
    createAt: z.coerce.date().optional()
})

export type Reservation =  z.infer<typeof ReservationSchema>