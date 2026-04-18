
import { db } from "../../db/db.ts";
import { adminsTable, session } from "../../db/schemas.ts";
import {  eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { Context } from "hono";

type UserRole = "admin" | "student" | "teacher";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

const isUserRole = (role: unknown): role is UserRole => {
    return role === "admin" || role === "student" || role === "teacher";
};


class AuthService {
    getErrorMessage(error: any, fallbackMessage: string) {
        return error?.body?.message || error?.message || fallbackMessage;
    }

    getErrorStatus(error: any, fallbackStatus: number) {
        if (typeof error?.statusCode === "number") {
            return error.statusCode;
        }

        if (typeof error?.status === "number") {
            return error.status;
        }

        if (typeof error?.status === "string") {
            const normalized = error.status.toUpperCase();
            if (normalized === "FORBIDDEN") return 403;
            if (normalized === "UNAUTHORIZED") return 401;
            if (normalized === "BAD_REQUEST") return 400;
            if (normalized === "NOT_FOUND") return 404;
            if (normalized === "CONFLICT") return 409;
        }

        return fallbackStatus;
    }

    isUserAlreadyExistsError(error: any) {
        const bodyMessage = String(error?.body?.message || "").toLowerCase();
        const bodyCode = String(error?.body?.code || "");
        const errorMessage = String(error?.message || "").toLowerCase();
        const causeCode = String(error?.cause?.code || "");
        const constraint = String(error?.cause?.constraint || "").toLowerCase();

        return (
            bodyCode === "USER_ALREADY_EXISTS" ||
            bodyMessage.includes("already exists") ||
            errorMessage.includes("already exists") ||
            errorMessage.includes("duplicate key value") ||
            (causeCode === "23505" &&
                (constraint === "users_email_unique" || constraint === "admins_user_id_unique"))
        );
    }

    async findUserByEmail(email: string) {
        return db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        });
    }

    async findUserById(userId: string) {
        return db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
        });
    }

    async hasActiveSession(userId: string, sessionId?: string) {
        const now = new Date();

        const activeSession = await db.query.session.findFirst({
            where: (sessions, { and, eq, gt }) =>
                sessionId
                    ? and(
                        eq(sessions.userId, userId),
                        eq(sessions.id, sessionId),
                        gt(sessions.expiresAt, now),
                    )
                    : and(eq(sessions.userId, userId), gt(sessions.expiresAt, now)),
        });

        return Boolean(activeSession);
    }

    resolveLoginFailure(data: any): { message: string; status: 400 | 401 | 403 } | null {
        const message = typeof data?.message === "string" ? data.message : null;
        if (!message) {
            return null;
        }

        const normalizedMessage = message.toLowerCase();
        const normalizedCode = String(data?.code || "").toUpperCase();

        // Better Auth can return a 200 payload for unverified email login attempts.
        if (
            normalizedCode === "EMAIL_NOT_VERIFIED" ||
            normalizedMessage.includes("not verified")
        ) {
            return { message, status: 403 };
        }

        if (
            !data?.user?.id &&
            !data?.session?.id &&
            !data?.token &&
            normalizedMessage.includes("invalid")
        ) {
            return { message, status: 401 };
        }

        return null;
    }

    async enrichUserWithInfo(data: any) {
        if (!data?.user?.id || !isUserRole(data.user.role)) {
            return data;
        }

        const info = await this.getUserInfo(data.user.role, data.user.id);

        return {
            ...data,
            user: {
                ...data.user,
                info,
            },
        };
    }

    async addAdmin(data: any, schoolName: string) {
        const [admin] = await db.insert(adminsTable).values({
            userId: data.user.id,
            schoolName,
        }).returning({ id: adminsTable.id });

        return admin?.id;
    }

    async rotateSessionToken(c: Context, currentRefreshToken: string | null) {
        
        if (!currentRefreshToken) {

            return null;
        }
        const existingSession = await db.query.session.findFirst({
            where: (sessions, { eq }) => eq(sessions.token, currentRefreshToken),
        });

        if (!existingSession) {
            
            return null;
        }

        if (existingSession.expiresAt <= new Date()) {
            await db.delete(session).where(eq(session.token, currentRefreshToken));
            return null;
        }

        const { refreshToken: nextRefreshToken, accessToken } = await this.generateToken(
            c,
            {
                userId: existingSession.userId,
                sid: existingSession.id,
            },
            null,
        );
        const now = new Date();
        const nextExpiresAt = new Date(now.getTime() + SESSION_TTL_MS);

        await db
            .update(session)
            .set({
                token: nextRefreshToken,
                expiresAt: nextExpiresAt,
                updatedAt: now,
            })
            .where(eq(session.token, currentRefreshToken))
            .returning({
                token: session.token,
                expiresAt: session.expiresAt,
            });

        

        return accessToken ;
    }

    

    async getUserInfo(role: UserRole, userId: string) {
        let info;

        if (role === "admin") {
            const admin = await db.query.adminsTable.findFirst({
                where: (admins, { eq }) => eq(admins.userId, userId),
            });
            info = admin;
        } else if (role === "student") {
            const student = await db.query.studentsTable.findFirst({
                where: (students, { eq }) => eq(students.userId, userId),
            });
            info = student;
        } else {
            const teacher = await db.query.teachersTable.findFirst({
                where: (teachers, { eq }) => eq(teachers.userId, userId),
            });
            info = teacher;
        }

        return info;
    }
    async generateToken(
        c: Context,
        payload: { userId: string; sid?: string },
        refreshToken: string | null,
    ) {
        const nextRefreshToken = refreshToken || randomBytes(32).toString("hex");

        let sessionId = payload.sid || null;
        if (!sessionId && refreshToken) {
            const existingSession = await db.query.session.findFirst({
                where: (sessions, { eq }) => eq(sessions.token, refreshToken),
            });
            sessionId = existingSession?.id || null;
        }

        if (!sessionId) {
            throw new Error("Session id not found for access token generation");
        }

        const nowInSeconds = Math.floor(Date.now() / 1000);
        const accessToken = await sign(
            {
                userId: payload.userId,
                sid: sessionId,
                iat: nowInSeconds,
                exp: nowInSeconds + ACCESS_TOKEN_TTL_SECONDS,
            },
            process.env.JWT_SECRET!,
        );

        setCookie(c, "refreshToken", nextRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, 
        });

        return {
            accessToken,
            refreshToken: nextRefreshToken,
        };
    }
}


export const authService = new AuthService();


