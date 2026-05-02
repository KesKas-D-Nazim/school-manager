import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono, ValidationTargets } from "hono";
import { cors } from 'hono/cors'
import authRouter from "./modules/auth/auth.router.js";
import { db } from "./db/db.js";
import { adminRouter } from "./modules/admin/admin.router.js";
import studentsRouter from "./modules/students/students.router.js";
import { teachersRouter } from "./modules/teachers/teachers.router.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { auth } from "./utils/auth.js";

import sharedRouter from "./modules/shared.router.js";
import { notificationsRouter } from "./modules/notifications/notifications.router.js";

const app = new Hono();
const port = Number(process.env.PORT || 4000);

app.use("*", cors());

// app.use('*', cors({
//   origin: ['http://localhost:3000'],
//   allowHeaders: ['Authorization', 'Content-Type'],
//   allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   credentials: true,
// }))
app.use("/api/*", authMiddleware)
app.use("/auth/logout", authMiddleware)

// app
//   .get("/", async (c) => {
//     return c.json({ message: "hello world" });

//   });

// app.route("/auth", authRouter);

// app.on(["POST", "GET"], "/better-auth/**", async (c) => {
//   return auth.handler(c.req.raw);
// });

// app.route("/api/admin", adminRouter);
app.route("/student", studentsRouter);
app.route("/api/teachers", teachersRouter);

// app.route("/", sharedRouter);

app.route("/notifications", notificationsRouter)

app.route("/admin", adminRouter);

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404)
})
app.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

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
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
