
import { Context } from "hono";
import { auth } from "../../utils/auth.js";
import type { LoginBody, RegisterBody } from "./auth.schema.js";
import { authService } from "./auth.service.js";
import { deleteCookie, getCookie } from "hono/cookie";

class AuthController {
    async login(c: Context) {
        const payload = (await c.req.json()) as LoginBody;
        const { email, password, rememberMe, callbackURL, role } = payload;

        try {
            const data = await auth.api.signInEmail({
                body: {
                    email,
                    password,
                    rememberMe,
                    callbackURL,
                },
                headers: c.req.raw.headers,
            });
            if (role != data.user.role) {
                return c.json(
                    {
                        message: "Invalid role for the user",
                    },
                    403,
                );
            }
            const loginFailure = authService.resolveLoginFailure(data);
            if (loginFailure) {
                return c.json(
                    {
                        message: loginFailure.message,
                    },
                    loginFailure.status,
                );
            }

            if (typeof data?.token !== "string" || !data.token) {
                return c.json(
                    {
                        message: "Authentication succeeded but session token is missing",
                    },
                    500,
                );
            }

            const { accessToken } = await authService.generateToken(
                c,
                { userId: data.user.id },
                data.token,
            );
            const response = await authService.enrichUserWithInfo({ ...data, token: accessToken });
            return c.json(response);
        } catch (error: any) {
            return c.json(
                {
                    message: authService.getErrorMessage(error, "Authentication failed"),
                },
                authService.getErrorStatus(error, 401),
            );
        }
    }

    async register(c: Context) {
        const payload = (await c.req.json()) as RegisterBody;
        const { fullName, schoolName, email, password, rememberMe, callbackURL } =
            payload;

        try {
            const existingUser = await authService.findUserByEmail(email);
            if (existingUser) {
                return c.json(
                    {
                        message: "User already exists",
                    },
                    409,
                );
            }

            const data = await auth.api.signUpEmail({
                body: {
                    name: fullName,
                    email,
                    password,
                    rememberMe,
                    callbackURL,
                    role: "admin",
                },

            });

            const schoolId = await authService.addAdmin(data, schoolName);

            if (typeof data?.token !== "string" || !data.token) {
                return c.json(
                    {
                        message: "Registration succeeded but session token is missing",
                    },
                    500,
                );
            }

            const { accessToken } = await authService.generateToken(
                c,
                { userId: data.user.id },
                data.token,
            );
            const response = await authService.enrichUserWithInfo({ ...data, token: accessToken });
            return c.json(response, 201);
        } catch (error: any) {
            if (authService.isUserAlreadyExistsError(error)) {
                return c.json(
                    {
                        message: "User already exists",
                    },
                    409,
                );
            }

            return c.json(
                {
                    message: authService.getErrorMessage(error, "Registration failed"),
                },
                authService.getErrorStatus(error, 400),
            );
        }
    }

    async logout(c: Context) {
        try {
            const currentRefreshToken = getCookie(c, "refreshToken");
            if (!currentRefreshToken) {
                return c.json({
                    message: "Logged out successfully",
                    redirectURL: "/",
                });
            }

            const signOutHeaders = new Headers(c.req.raw.headers);
            signOutHeaders.set("Authorization", `Bearer ${currentRefreshToken}`);

            await auth.api.signOut({
                headers: signOutHeaders,
            });
            deleteCookie(c, "refreshToken");
            return c.json({
                message: "Logged out successfully",
                redirectURL: "/",
            });
        } catch (error: any) {
            return c.json(
                {
                    message: authService.getErrorMessage(error, "Logout failed"),
                    redirectURL: "/",
                },
                authService.getErrorStatus(error, 400),
            );
        }
    }
    async refresh(c: Context) {
        const currentRefreshToken = getCookie(c, "refreshToken");



        if (!currentRefreshToken) {
            return c.json(
                {
                    message: "no session token provided",
                },
                401,
            );
        }

        try {
            const refreshResult = await authService.rotateSessionToken(c, currentRefreshToken);

            if (!refreshResult) {
                return c.json(
                    {
                        message: "Invalid or expired session token",
                    },
                    401,
                );
            }

            return c.json(
                {
                    token: refreshResult.accessToken,
                    user: refreshResult.user,
                },
                200,
            );
        } catch (error: any) {
            return c.json(
                {
                    message: authService.getErrorMessage(error, "Session refresh failed"),
                },
                authService.getErrorStatus(error, 400),
            );
        }
    }
    
}

export const authController = new AuthController();
