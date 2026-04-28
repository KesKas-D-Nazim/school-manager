import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono, ValidationTargets } from "hono";
import { cors } from 'hono/cors'
import authRouter from "./modules/auth/auth.router.ts";
import { db } from "./db/db.ts";
//import { adminRouter } from "./modules/admin/admin.router.ts";
import studentRouter from "./modules/student/student.router.ts";
import { teachersRouter } from "./modules/teachers/teachers.router.ts";
import { authMiddleware } from "./middleware/authMiddleware.ts";
import { auth} from "./utils/auth.ts";

import sharedRouter from "./modules/shared.router.ts"; 
import { notificationsRouter } from "./modules/notifications/notifications.router.ts";

const app = new Hono();

app.use('*', cors({
    origin: ['http://localhost:3000'],
    allowHeaders: ['Authorization', 'Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
}))
app.use("/api/*", authMiddleware)
app.use("/auth/logout", authMiddleware) 

app
.get("/", async (c) => {
  return c.json({ message: "hello world" });

});

app.route("/auth", authRouter);

app.on(["POST", "GET"], "/better-auth/**", async (c) => {
  return auth.handler(c.req.raw);
});

//app.route("/api/admin", adminRouter);
app.route("/student", studentRouter);
app.route("/api/teachers", teachersRouter);

app.route("/", sharedRouter);

app.route("/notifications", notificationsRouter)

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404)
})

// this is the error handler for the app but it needs some work 

// app.onError((err, c) => {
//   // 1. Check if it's a Zod validation error
//   if (err instanceof ZodError) {
//     return c.json(validationErrorResponse(err), 400);
//   }

//   // 2. Check if it's a standard Hono HTTP error (e.g., 404, 401)
//   if (err instanceof HTTPException) {
//     return c.json(httpExceptionResponse(err.message), err.status);
//   }

//   // 3. Otherwise, it's a normal server error (like your database crashing)
//   console.error(err);
//   return c.json(internalServerErrorResponse(), 500);
// });

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
