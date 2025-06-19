import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().optional(),
    email: z.string().email(),
    name: z.string().optional(),
    hashedPassword: z.string().optional(),
    emailVerified: z.date().nullable().optional(),
    image: z.string().url().nullable().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export type User = z.infer<typeof UserSchema>

