const nodemailer = require('nodemailer');
const { getOtp, setOtp } = require('../Services/OtpService');

async function sendMail(email) {
    try {
     
        const otp = Math.floor(1000 + Math.random() * 9000);

    
        await setOtp(email, otp);


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        });


        const mailOptions = {
            from: process.env.MAIL_ADDRESS,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for Two Factor Authentication to login to your account is ${otp}. This OTP will expire in 2 minutes.`,
        };


        await transporter.sendMail(mailOptions);


        return {
            success: true,
            message: 'OTP Email sent successfully',
        };
    } catch (error) {


        return {
            success: false,
            message: 'Failed to send OTP email',
            error: error.message, 
        };
    }
}

module.exports = sendMail;
