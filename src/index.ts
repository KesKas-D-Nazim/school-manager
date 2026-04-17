import { serve } from "@hono/node-server";
import { Hono, ValidationTargets } from "hono";
import { cors } from 'hono/cors'
import "dotenv/config";
import authRouter from "./modules/auth/auth.router.ts";
import { db } from "./db/db.ts";
import { adminRouter } from "./modules/admin/admin.router.ts";
import { studentsRouter } from "./modules/students/students.router.ts";
import { logger } from 'hono/logger'
import z, { ZodError, ZodSchema } from "zod";
import { HTTPException } from "hono/http-exception"
import { zValidator } from "@hono/zod-validator";
import { httpExceptionResponse, internalServerErrorResponse, validationErrorResponse } from "./utils/response.type.ts";

const app = new Hono();


app.use("/", logger())
app.use('*', cors({
  origin: "http://localhost:3000",
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.get("/", async (c) => {
  const data = await db.query.users.findMany();
  return c.json({ message: "Welcome to the School Manager API", data }, 200);
});

app.route("/auth", authRouter);

app.route("/admin", adminRouter);

app.route("/students", studentsRouter);

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404)
})



app.onError((err, c) => {
  // 1. Check if it's a Zod validation error
  if (err instanceof ZodError) {
    return c.json(validationErrorResponse(err), 400);
  }

  // 2. Check if it's a standard Hono HTTP error (e.g., 404, 401)
  if (err instanceof HTTPException) {
    return c.json(httpExceptionResponse(err.message), err.status);
  }

  // 3. Otherwise, it's a normal server error (like your database crashing)
  console.error(err);
  return c.json(internalServerErrorResponse(), 500);
});

serve(
  {
    fetch: app.fetch,
    port: 8888,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);