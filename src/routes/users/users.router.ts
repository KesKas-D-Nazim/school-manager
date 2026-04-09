import { Hono } from "hono"
import { loginController, registerController } from "./users.controller.js"
import { zValidator } from "@hono/zod-validator"
import z from "zod"

const usersRouter = new Hono()

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(3),
})

usersRouter
    .post("/register", zValidator('json', registerSchema), registerController)
    .post("/login", zValidator('json', loginSchema), loginController)


export default usersRouter