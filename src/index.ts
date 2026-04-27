import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from 'hono/cors'
import authRouter from "./modules/auth/auth.router.ts";
import { db } from "./db/db.ts";
import { adminRouter } from "./modules/admin/admin.router.ts";
import studentsRouter from "./modules/students/students.router.ts";
import { teachersRouter } from "./modules/teachers/teachers.router.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
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
app.route("/student", studentsRouter);
app.route("/api/teachers", teachersRouter);

app.route("/", sharedRouter);

app.route("/notifications", notificationsRouter)

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404)
})

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
