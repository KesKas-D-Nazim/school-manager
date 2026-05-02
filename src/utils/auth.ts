import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { bearer } from "better-auth/plugins/bearer";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.js";
import { sendVerificationEmail } from "../emails/sendEmail.js";
import { handlePassword } from "./hash_password.js";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:8888";
const basePath = "/api/better-auth";
const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;
const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24;

const socialProviders = {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
        }
        : {}),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
        ? {
            facebook: {
                clientId: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            },
        }
        : {}),
};


export const auth = betterAuth({
    baseURL,
    basePath,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    plugins : [
        bearer(),
        openAPI()
    ],
    user: {
        modelName: "users",
        additionalFields: {
            role: {
                type: ["student", "teacher", "admin"],
                required: true,
                defaultValue: "admin",
                input: true,
            },
        },
    },
    emailAndPassword: {
        password : {
            hash : handlePassword.hash,
            verify : ({ hash, password }) => handlePassword.verify(password, hash)
        },
        enabled: true,
        requireEmailVerification: false,
        minPasswordLength: 8,
        customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
            ...coreFields,
            ...additionalFields,
            id,
        }),
    },
    socialProviders,
    session: {
        expiresIn: SESSION_EXPIRES_IN_SECONDS,
        updateAge: SESSION_UPDATE_AGE_SECONDS,
    },
    /*emailVerification : {
        sendOnSignUp: true,
        sendVerificationEmail : async ({user , url , token} , req) => {
            await sendVerificationEmail(user.email, url, user.name ?? "there")
        }
    }*/
    

})
