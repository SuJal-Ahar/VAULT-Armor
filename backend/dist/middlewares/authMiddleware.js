import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(403).json({ message: "No token provided" });
    }
    // Handle both "Bearer <token>" and just "<token>"
    const parts = header.split(" ");
    const token = parts.length === 2 ? parts[1] : parts[0];
    if (!token) {
        return res.status(403).json({ message: "Malformed token" });
    }
    try {
        if (!JWT_SECRET)
            throw new Error("JWT_SECRET is missing");
        const decoded = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
//# sourceMappingURL=authMiddleware.js.map