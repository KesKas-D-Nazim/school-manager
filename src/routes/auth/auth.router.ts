import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import z from "zod"
import { authController } from "./auth.controller"


export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(3),
})

const usersRouter = new Hono()
    .post("/register", zValidator('json', registerSchema),
        async (c) => {
            const data = await c.req.valid("json");
            const reponse = authController.register(data);
            if (!reponse) {
                return c.text("User already exists", 400)
            }
            return c.json(reponse, 201)
        })
    .post("/login", zValidator('json', loginSchema), async (c) => {
        const data = await c.req.valid("json");
        const response = await authController.login(data);
        if (!response) {
            return c.text("Invalid credentials", 401)
        }
        return c.json(response, 200)
    })


export default usersRouter