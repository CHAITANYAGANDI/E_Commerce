const jwt = require('jsonwebtoken');
const {getOtp,setOtp} = require('../Services/OtpService');
const UserModel = require("../Models/User");

const { verify } = require('crypto');



const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    const otpFromDb = await getOtp(email);

    if (!otpFromDb || otpFromDb !== parseInt(otp, 10)) {
        return res.status(400).json({
            message: "Invalid or expired OTP",
            success: false
        });
    }

    const user = await UserModel.findOne({email});

    const jwtToken = jwt.sign(
        {
            email:user.email,_id:user._id
        },

        process.env.JWT_SECRET,
        {
            expiresIn:'1h'
        }
    )

    res.status(200).json({
        message: "OTP verified successfully",
        success: true,
        jwtToken
    });

    next();
};


module.exports = verifyOtp;