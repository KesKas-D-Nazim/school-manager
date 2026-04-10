import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { authController } from "./auth.controller"
import { loginSchema, registerSchema } from "./auth.schema";


const usersRouter = new Hono()
    .post("/register", zValidator('json', registerSchema),
        async (c) => {
            const data = c.req.valid("json");
            const reponse = authController.register(data);
            if (!reponse) {
                return c.text("User already exists", 400)
            }
            return c.json(reponse, 201)
        })
    .post("/login", zValidator('json', loginSchema), async (c) => {
        const data = c.req.valid("json");
        const response = await authController.login(data);
        if (!response) {
            return c.text("Invalid credentials", 401)
        }
        return c.json(response, 200)
    })


export default usersRouter