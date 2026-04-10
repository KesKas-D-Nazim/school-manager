import z from "zod"

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(3),
})

export type LoginBody = z.infer<typeof loginSchema>
export type RegisterBody = z.infer<typeof registerSchema>
