import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.adminId };
        next();
    } catch (e) {
        res.status(401).json({
            message: "Invalid or expired token."
        })
    }
}