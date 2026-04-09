import bcrypt from 'bcrypt';

export class PasswordHasher {
    private static saltRounds: number = 12;
    static hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }
    static comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
