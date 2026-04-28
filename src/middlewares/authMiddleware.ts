
import { Context } from "hono";
import { verify } from "hono/jwt";
import { authService } from "../modules/auth/auth.service.ts";


export const authMiddleware = async (c : Context, next: () => Promise<void>) => {

    const accessToken = c.req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    if (!process.env.JWT_SECRET) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    const decoded = await verify(accessToken, process.env.JWT_SECRET, "HS256").catch(() => null);
    const userId = decoded && typeof decoded.userId === "string" ? decoded.userId : null;
    const sessionId = decoded && typeof decoded.sid === "string" ? decoded.sid : null;

    if (!userId || !sessionId) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    const publicUser = await authService.findUserById(userId);

    if (!publicUser) {
        return c.json({ message: "Unauthorized" }, 401);
    }

    const hasActiveSession = await authService.hasActiveSession(publicUser.id, sessionId);
    if (!hasActiveSession) {
        return c.json({ message: "Session revoked" }, 401);
    }

    const userInfo = await authService.getUserInfo(publicUser.role, publicUser.id);
    

    c.set("user", {
        ...publicUser,
        info: userInfo,
    });

    c.set("session", { userId: publicUser.id });

    await next();
}