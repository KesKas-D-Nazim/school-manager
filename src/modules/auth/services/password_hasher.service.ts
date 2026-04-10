import bcrypt from 'bcrypt';

class PasswordHasher {
    private saltRounds: number = 12;
    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

export const passwordHasher = new PasswordHasher();
