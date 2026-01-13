import jwt from "jsonwebtoken";
export const currentUser = (req, res, next) => {
    // Middleware logic here
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.currentUser = payload;
    }
    catch (err) {
        console.error("invalid token -> user remains undefined", err);
        throw new Error("invalid token -> user remains undefined");
    }
    next();
};
//# sourceMappingURL=current-user.js.map