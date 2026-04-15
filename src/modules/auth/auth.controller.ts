import { findUserByEmail, createUser } from "../../db/repo/users.repository.js";
import { passwordHasher } from "./services/password_hasher.service.js";
import { LoginBody, RegisterBody } from "./auth.schema.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

class AuthController {

    async login(user: LoginBody) {
        const founduser = await findUserByEmail(user.email);

        if (!founduser) {
            throw new Error("User not found");
        }

        const isMatch = await passwordHasher.comparePassword(
            user.password,
            founduser.passwordHash
        );

        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: founduser.id },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        return { token };
    }

    async register(user: RegisterBody) {
        const foundUser = await findUserByEmail(user.email);
        if (foundUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await passwordHasher.hashPassword(user.password);

        const newUser = await createUser({
            id: uuidv4(),
            email: user.email,
            username: user.username,
            passwordHash: hashedPassword,
            role: "student", 
        });
        return newUser;

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