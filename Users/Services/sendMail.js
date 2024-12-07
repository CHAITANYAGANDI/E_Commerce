const nodemailer = require('nodemailer');
const { getOtp, setOtp } = require('../Services/OtpService');
const crypto = require('crypto');

async function sendMail(email) {
    try {
     
        const otp = crypto.randomInt(1000, 10000);

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
            subject: 'Trendy Treasures Password Assistance',
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
