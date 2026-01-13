export class CustomError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
//# sourceMappingURL=custom-errors.js.map