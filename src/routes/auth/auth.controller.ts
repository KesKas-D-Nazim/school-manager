import { db } from "../../db/db.js";
import { findUserByEmail } from "../../db/repo/users.repo.js";
import { usersTable } from "../../db/schema.js";
import { NewUser, User } from "../../types.js"
import { PasswordHasher } from "../../utils/passwordHash.js";

interface IUserAuth {
    login: (user: User) => Promise<User | undefined>;
    register: (user: NewUser) => Promise<User | undefined>;
}


class AuthController implements IUserAuth {
    async login(user: User) {
        const founduser = await findUserByEmail(user.email);

        if (!founduser) {
            throw new Error("User not found");
        }

        if (await PasswordHasher.comparePassword(user.password, founduser.password)) {
            return founduser;
        }
    }

    async register(user: NewUser) {
        const foundUser = await findUserByEmail(user.email);
        if (foundUser) {
            throw new Error("User already exists");
        }

        user.password = await PasswordHasher.hashPassword(user.password);

        const [newUser] = await db.insert(usersTable).values(user).returning();

        if (user) return newUser;

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