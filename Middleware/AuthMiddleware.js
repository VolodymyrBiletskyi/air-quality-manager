import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.slice(7);

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        const userId = payload.userId ?? payload.user_id ?? payload.id;

        if (!userId) {
            return res.status(401).json({
                message: "Token payload does not contain user id",
                payloadKeys: Object.keys(payload),
            });
        }

        req.user = {
            id: userId,
            role: payload.role,
        };

        next();
    } catch (e) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
