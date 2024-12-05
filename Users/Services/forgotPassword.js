const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const UserModel = require("../Models/User");
const {getOtp,setOtp} = require('../Services/OtpService');


const forgotPassword = async (req, res) => {
    
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    setOtp(email, otp);


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD
        }
 
    });

    const mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: email,
        subject: 'Trendy Treasures Password Recovery',
        text:`Your OTP for password reset is ${otp}. This OTP will expire in 2 minutes.`

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {

            return res.status(500).json({
                message: "Failed to send OTP email",
                success: false
              
            });
        } else {

            res.status(200).json({
                message: "OTP sent successfully",
                success: true,
                email
            });
            
        }
    });
};


const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(200).json({ message: "Password reset successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", success: false });
    }
};


const verifyOtp = async (req, res) => {
    const { currentUser, otp } = req.body;

    const otpFromDb = await getOtp(currentUser);

    if (!otpFromDb || otpFromDb !== parseInt(otp, 10)) {
        return res.status(400).json({
            message: "Invalid or expired OTP",
            success: false
        });
    }

    res.status(200).json({
        message: "OTP verified successfully",
        success: true
    });
};

module.exports = {
    forgotPassword,
    resetPassword,
    verifyOtp
}