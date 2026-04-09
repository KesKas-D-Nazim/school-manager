import { db } from "../../db/db.js";
import { findUserByEmail } from "../../db/repo/users.repo.js";
import { usersTable } from "../../db/schema.js";
import { NewUser, User } from "../../types.js"
import z from "zod"
import { PasswordHasher } from "../../utils/passwordHash.js";
import { loginSchema, registerSchema } from "./auth.router.js";

type login = z.infer<typeof loginSchema>
type register = z.infer<typeof registerSchema>

interface IUserAuth {
    login: (user: login) => Promise<login | undefined>;
    register: (user: register) => Promise<register | undefined>;
}


class AuthController implements IUserAuth {

    async login(user: login) {
        const founduser = await findUserByEmail(user.email);

        if (!founduser) {
            throw new Error("User not found");
        }

        if (await PasswordHasher.comparePassword(user.password, founduser.password)) {
            return founduser;
        }
    }

    async register(user: register) {
        const foundUser = await findUserByEmail(user.email);
        if (foundUser) {
            throw new Error("User already exists");
        }

        user.password = await PasswordHasher.hashPassword(user.password);

        // const [newUser] = await db.insert(usersTable).values(user).returning();

        if (user) return user;

    }
}

export const authController = new AuthController();



// export const registerController = { const response = await userAuth.register(data) }

// export const loginController = async (c: any) => {
//     const user = await c.req.json()
//     const response = await userAuth.login(user)
//     if (!response) {
//         return c.text("Invalid credentials", 401)
//     }
//     return c.json(response, 200)
// }