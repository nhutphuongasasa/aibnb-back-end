import { z } from "zod";

export enum ListingCategory {
    Beach = 'Beach',
    Windmills = 'Windmills',
    Modern = 'Modern',
    Countryside = 'Countryside',
    Pools = 'Pools',
    Island = 'Island',
    Lake = 'Lake',
    Skiing = 'Skiing',
    Castle = 'Castle',
    Camping = 'Camping',
    Arctic = 'Arctic',
    Cave = 'Cave',
    Desert = 'Desert',
    Barn = 'Barn',
    Lux = 'Lux',
}

export const ListingSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageSrc: z.array(z.string().url("Invalid image URL")).optional(),
    createAt: z.date().optional(),
    category: z.string().min(1, "Category is required"),
    roomCount: z.number().int().min(1, "Room count must be at least 1").optional(),
    bathroomCount: z.number().int().min(1, "Bathroom count must be at least 1").optional(),
    guestCount: z.number().int().min(1, "Guest count must be at least 1").optional(),
    locationValue: z.string().min(1, "Location value is required").optional(),
    userId: z.string(),
    price: z.number().min(0, "Price must be a positive number").optional(),
})

export type Listing = z.infer<typeof ListingSchema>

// export type Listing = z.infer<typeof ListingSchema> & {
//     user?: ListingUser,
//     reservations?: ListingReservation[]
// };

// export const ListingUserSchema = z.object({
//     id: z.string(),
//     name: z.string().optional(),
//     email: z.string().email("Invalid email address")
// })

// export type ListingUser = z.infer<typeof ListingUserSchema>;

// export const ListingReservationSchema = z.object({
//     id: z.string(),
//     startDate: z.date(),
//     endDate: z.date(),
//     totalPrice: z.number().min(0, "Total price must be a positive number"),
//     useId: z.string(),
// })

// export type ListingReservation = z.infer<typeof ListingReservationSchema>

