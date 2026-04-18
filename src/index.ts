import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from 'hono/cors'
import authRouter from "./modules/auth/auth.router.ts";
import { db } from "./db/db.ts";
//import { adminRouter } from "./modules/admin/admin.router.ts";
import studentsRouter from "./modules/students/students.router.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import { auth} from "./utils/auth.ts";

const app = new Hono();

app.use('*', cors())
app.use("/api/**", authMiddleware)
app.use("/auth/logout", authMiddleware) 

app
.get("/", async (c) => {
  return c.json({ message: "hello world" });

});

app.route("/auth", authRouter);

app.on(["POST", "GET"], "/better-auth/**", async (c) => {
  return auth.handler(c.req.raw);
});

app.route("/api/admin", adminRouter);

app.route("/api/students", studentsRouter);

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
