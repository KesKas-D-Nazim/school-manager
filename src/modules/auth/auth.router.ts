import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { authController } from "./auth.controller.js"
import { loginSchema, registerSchema } from "./auth.schema.js";


const usersRouter = new Hono()
    .post("/register", zValidator('json', registerSchema),authController.register)
    .post("/login", zValidator('json', loginSchema),authController.login)
    .post("/logout",authController.logout)
    .post("/refresh", authController.refresh)
    // .post("/get-session",authController.getSession)


export default usersRouter