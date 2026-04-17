export function generateTemporaryPassword(password: string) {
    return password
        .toLowerCase()
        .replace(/\s+/g, "_");
}