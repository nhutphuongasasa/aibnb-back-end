import { z } from "zod";

export const UserCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
})

export type UserCreateDTO = z.infer<typeof UserCreateSchema>;

// export const UserGetByEmailSchema = z.object({
//     email: z.string().email("Invalid email address")
// })

// export type UserGetByEmailDTO = z.infer<typeof UserGetByEmailSchema>;

export const UserCondDTO = z.object({
    email: z.string().email("Invalid email address").optional(),
    name: z.string().optional()
})

export type UserCondDTO = z.infer<typeof UserCondDTO>

export const UserResponseSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email address"),
    image: z.string().url().optional(),
    favoriteIds: z.array(z.string())
})

export type UserResponse = z.infer<typeof UserResponseSchema>

export const HostResponseSchema = z.object({
    user: z.string(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    image: z.string().url().optional(),
})

export type HOstResponse = z.infer<typeof HostResponseSchema>
