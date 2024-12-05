const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.adminId = decoded._id;

        next();
        
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }

        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
