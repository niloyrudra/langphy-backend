export declare class Password {
    static toHash(password: string): Promise<string>;
    static compare(storedPasword: string, suppliedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=password.d.ts.map