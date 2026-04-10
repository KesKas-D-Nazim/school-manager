import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from 'hono/cors'
import "dotenv/config";
import authRouter from "./modules/auth/auth.router.ts";
import { db } from "./db/db.ts";
import { adminRouter } from "./modules/admin/admin.router.ts";
import { studentsRouter } from "./modules/students/students.router.ts";

const app = new Hono();

app.use('*', cors())

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

serve(
  {
    fetch: app.fetch,
    port: 8888,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);