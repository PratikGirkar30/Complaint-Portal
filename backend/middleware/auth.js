import jwt from 'jsonwebtoken';

export const optionalAuth = (req, res, next) => {
    // parse token if present, but do not fail if missing
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, name, email, role }
    } catch (err) {
        console.log('JWT verify failed:', err.message);
        req.user = null; // invalid token -> treat as not logged in
    }
    next();
};

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    if (!authHeader) {
        req.user = null;
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
};
