import { passwordHasher } from "./services/password_hasher.service.js";
import { LoginBody, RegisterBody } from "./auth.schema.js";
import { usersRepository,IUsersRepository } from "../../db/repo/users.repository.js";

class AuthController {
    constructor(private readonly usersRepository: IUsersRepository) { }

    async login(user: LoginBody) {
        const founduser = await this.usersRepository.findUserByEmail(user.email);

        if (!founduser) {
            throw new Error("User not found");
        }

        //if (await PasswordHasher.comparePassword(user.password, founduser.password)) {
        //    return founduser;
        //}
        return undefined;
    }

    async register(user: RegisterBody) {
        const foundUser = await this.usersRepository.findUserByEmail(user.email);
        if (foundUser) {
            throw new Error("User already exists");
        }

        user.password = await passwordHasher.hashPassword(user.password);

        // const [newUser] = await db.insert(usersTable).values(user).returning();

        if (user) return user;

    }
}

export const authController = new AuthController(usersRepository);



// export const registerController = { const response = await userAuth.register(data) }

// export const loginController = async (c: any) => {
//     const user = await c.req.json()
//     const response = await userAuth.login(user)
//     if (!response) {
//         return c.text("Invalid credentials", 401)
//     }
//     return c.json(response, 200)
// }