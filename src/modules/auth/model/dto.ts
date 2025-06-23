import { z } from "zod"

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export type LoginDTO = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string()
})

export type RegisterDTO = z.infer<typeof RegisterSchema>

export const LoginResponseSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    image: z.string().url().nullable().optional()
})

export type LoginResponse = z.infer<typeof LoginResponseSchema>