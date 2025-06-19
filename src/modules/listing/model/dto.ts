import { optional, z } from "zod";

export const ListingCreateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageSrc: z.array(z.string().url("Invalid image URL")).optional(),
    category: z.string().min(1, "category is required"),
    roomCount: z.number().int().min(1, "Room count must be at least 1"),
    bathroomCount: z.number().int().min(1, "Bathroom count must be at least 1"),
    guestCount: z.number().int().min(1, "Guest count must be at least 1"),
    location: z.object({
        value: z.string(),
        label: z.string(),
        flag: z.string(),
        latlng: z.tuple([z.number(), z.number()]),
        region: z.string()
      }),
    price: z.number().min(0, "Price must be a positive number"),
    userId: z.string().min(1, "Host is required"),
})

export type ListingCreateDTO = z.infer<typeof ListingCreateSchema>;

export const ListingResponseSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageSrc: z.array(z.string().url("Invalid image URL")).optional(),
    category: z.string().min(1, "Category is required"),
    roomCount: z.number().int().min(1, "Room count must be at least 1").optional(),
    bathroomCount: z.number().int().min(1, "Bathroom count must be at least 1").optional(),
    guestCount: z.number().int().min(1, "Guest count must be at least 1").optional(),
    locationValue: z.string().min(1, "Location value is required").optional(),
    userId: z.string({required_error: "okqqqqqqqqqqqqqqqqq"}),
    price: z.number().min(0, "Price must be a positive number").optional(),
})

export type ListingResponse = z.infer<typeof ListingResponseSchema> & {
    user?: ListingUser,
    reservations?: ListingReservation[]
};

export const ListingUserSchema = z.object({
    id: z.string({required_error: "userId is required"}),
    name: z.string().optional(),
    email: z.string().email("Invalid email address")
})

export type ListingUser = z.infer<typeof ListingUserSchema>;

export const ListingReservationSchema = z.object({
    id: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    totalPrice: z.number().min(0, "Total price must be a positive number"),
    useId: z.string(),
})

export type ListingReservation = z.infer<typeof ListingReservationSchema>

export const ListingCondDTOSchema = z.object({
    id: z.array(z.string()).optional().nullable(),

    userId: z.string().optional(),
    category: z.string().optional(),
    // roomCount: z.number().int().min(1, "Room count must be at least 1").optional(),
    // bathroomCount: z.number().int().min(1, "Bathroom count must be at least 1").optional(),
    // guestCount: z.number().int().min(1, "Guest count must be at least 1").optional(),
    // localVale: z.string().optional(),
    // price: z.number().min(0, "Price must be a positive number").optional(),
    // startDate: z.date().optional(),
    // endDate: z.date().optional(),
    roomCount: z.coerce.number().int().min(1, "Room count must be at least 1").optional(),
    bathroomCount: z.coerce.number().int().min(1, "Bathroom count must be at least 1").optional(),
    guestCount: z.coerce.number().int().min(1, "Guest count must be at least 1").optional(),
    localVale: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be a positive number").optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
})

export type ListingCondDTO = z.infer<typeof ListingCondDTOSchema>;

