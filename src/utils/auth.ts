import {betterAuth} from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db";


export const auth = betterAuth({
    database: drizzleAdapter(db,{
        provider : "pg",
    }),
    plugins : [
        username(),
    ],
    user:{
        modelName : "users",
    },
    emailAndPassword :{
        enabled : true,
        minPasswordLength : 8,
    },
    socialProviders: {
        google:{
            clientId : process.env.GOOGLE_CLIENT_ID as string,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET as string
        },
        facebook:{
            clientId : process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret : process.env.FACEBOOK_CLIENT_SECRET as string
        },
    }
    
})