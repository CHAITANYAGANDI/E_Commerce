const ensureAuthenticated = require('../Middlewares/Authorization');
const ensuregoogleAuthenticated = require('../Middlewares/googleAuthorization');
const  {signup,login,verifyOtp} = require('../Controllers/AuthController');
const express = require("express");
const router = express.Router();


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

    if (otpStatus === 'OTP verified successfully'){

        next();
    }

    else{
        return res.status(403).json({ message: 'Unauthorized: OTP is not correct' });
    }


    
};

router.get('/',ensureEitherAuthenticated,ensureOtpVerified,(req,res)=>{

    res.status(200).json([
        {
            name:"mobile",
            price:10000
        },
        {
            name:'tv',
            price:20000
        }

    ])

});



// router.get('/',ensureEitherAuthenticated,(req,res)=>{

//     res.status(200).json([
//         {
//             name:"mobile",
//             price:10000
//         },
//         {
//             name:'tv',
//             price:20000
//         }

//     ])

// });


module.exports = router;