import bcrypt from 'bcrypt';
export class Password {
    static async toHash(password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }
    static async compare(storedPasword, suppliedPassword) {
        const passwordMatch = await bcrypt.compare(suppliedPassword, storedPasword);
        return passwordMatch;
    }
}
//# sourceMappingURL=password.js.map