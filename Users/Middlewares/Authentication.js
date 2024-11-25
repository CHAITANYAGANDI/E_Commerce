const ensureAuthenticated = require('./Authorization');
const ensuregoogleAuthenticated = require('./googleAuthorization');


const ensureEitherAuthenticated = (req, res, next) => {

         ensureAuthenticated(req, res, (jwtError) => {

        
        if (!jwtError) {
    
            return next();
        } else {

            ensuregoogleAuthenticated(req, res, (googleError) => {
                if (!googleError) {

                    return next();
                } else {

                    return res.status(403).json({ message: 'Unauthorized: Both tokens invalid' });
                }
            });
        }
    });
};




const ensureOtpVerified = (req,res,next) =>{

    const otpStatus = req.headers['otp_verification_status'];

    if (otpStatus === 'OTP verified successfully' || req.headers['google_access_token']){

        next();
    }

    else{
        return res.status(403).json({ message: 'Unauthorized: OTP is not correct' });
    }
    
};


module.exports = {ensureEitherAuthenticated,ensureOtpVerified};