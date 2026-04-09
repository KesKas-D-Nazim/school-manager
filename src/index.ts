import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { adminRouter } from "./routes/admin/admin.router.ts";
import { cors } from 'hono/cors'
import "dotenv/config";
import authRouter from "./routes/auth/auth.router.ts";

const app = new Hono();

app.use('*', cors())

app.route("/auth",authRouter);

app.route("/admin", adminRouter);

app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404)
})

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);