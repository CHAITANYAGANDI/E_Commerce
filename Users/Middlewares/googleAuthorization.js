const axios = require('axios');

const ensuregoogoleAuthenticated = async (req,res,next)=>{

    const googleAuth = req.headers['google_access_token'];


    if(!googleAuth){
            return res.status(403).json({message:'Unauthorized'});
    }

    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo', {
        params: { access_token: googleAuth },
        });
    
        if (response.data.aud === process.env.GOOGLE_CLIENT_ID) {

        req.user = response.data; 
        return next();
        } else {
        return res.status(403).json({ message: 'Unauthorized: Invalid Google Token' });
        }
    } catch (error) {
        console.error('Google token verification failed:', error.message);
        return res.status(403).json({ message: 'Unauthorized: Token verification failed' });
    }
    
};

module.exports = ensuregoogoleAuthenticated;