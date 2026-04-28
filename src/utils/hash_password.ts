import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

class HandlePassword {
    async hash(password: string): Promise<string> {
			const salt = await bcrypt.genSalt(SALT_ROUNDS);
			return bcrypt.hash(password, salt);
		}
		async verify(
				password: string,
				hashedPassword: string
		
		): Promise<boolean> {
				return bcrypt.compare(password, hashedPassword);
		}
}

export const handlePassword = new HandlePassword();


