import { NewUser, User } from '../../types.js';
import { db } from '../../db/db.js';
import { usersTable } from '../../db/schema.js';
import { PasswordHasher } from '../../utils/passwordHash.js';
import { findUserByEmail } from '../../db/repo/users.repo.js';


interface UserAuth {
    login: (user: User) => Promise<User | undefined>;
    register: (user: NewUser) => Promise<User | undefined>;
}

class usersAuth implements UserAuth {
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

        if (user)
            return newUser;
    }
}

export const userAuth = new usersAuth()