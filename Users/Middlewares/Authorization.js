const axios = require('axios');
const jwt = require('jsonwebtoken');

const ensureAuthorized = async (req, res, next) => {
    const userToken = req.headers['authorization'];

    if (!userToken || userToken === 'null') {
        return res.status(403).json({ message: 'Unauthorized: Token not provided' });
    }

    try {
    
        if (userToken.startsWith('ya29.')) { 
            const response = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
                params: { access_token: userToken },
            });

            if (response.data.aud === process.env.GOOGLE_CLIENT_ID) {
                req.user = response.data;
                return next();
            } else {
                return res.status(403).json({ message: 'Unauthorized: Invalid Google Token' });
            }
        } else {

            const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        }
    } catch (error) {
        console.error('Token verification failed:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized: Token has expired' });
        }
        return res.status(403).json({ message: 'Unauthorized: Token verification failed' });
    }
};

module.exports = ensureAuthorized;
