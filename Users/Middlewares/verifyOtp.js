const jwt = require('jsonwebtoken');
const {getOtp,setOtp} = require('../Services/OtpService');
const UserModel = require("../Models/User");


const verifyOtp = async (req, res, next) => {
    try {

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
                success: false
            });
        }

        const otpFromDb = await getOtp(email)

        if (!otpFromDb || otpFromDb !== parseInt(otp, 10)) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const jwtToken = jwt.sign(
            {
                email: user.email,
                _id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "OTP verified successfully",
            success: true,
            jwtToken
        });

        next();
    } catch (err) {
        
        console.error("Error during OTP verification:", err.message);

        res.status(500).json({
            message: "An unexpected error occurred during OTP verification",
            success: false,
            error: err.message
        });
    }
};



module.exports = verifyOtp;