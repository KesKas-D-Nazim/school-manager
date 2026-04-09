import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { adminRouter } from "./routes/admin/admin.router.ts";
import { cors } from 'hono/cors'
import "dotenv/config";

const app = new Hono();

app.use('/*', cors())

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/admin", adminRouter);

app.get("/*", (c) => {
  return c.json("hello");
});

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