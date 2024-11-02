const bcrypt = require('bcryptjs');
const UserModel = require("../Models/User");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const otpStore = new Map();

const signup = async (req,res) =>{
    try {
        const {name, email, password} = req.body;

        const user = await UserModel.findOne({email});

        if (user){

            return res.status(409).json({
                message: "this email already exists", success:false
            });

        }

        const userModel = new UserModel({name, email, password});
        const salt = await bcrypt.genSalt(10);
        userModel.password = await bcrypt.hash(password,salt);

        await userModel.save();

        res.status(201).json({
            message: "Signup Successfully",
            success:true
        })

    }

    catch(err){

        res.status(500).json({
            message:"Internal server error",
            success:false
        })

    }
}


const login = async (req,res) => {

    try{

        const {email,password} = req.body;

        const user = await UserModel.findOne({email});
  
        const erroMessage = 'Invalid Credentials';


        if(!user){

            return res.status(403).json({message:erroMessage,success:false});

        }

        const passwordComparison = await bcrypt.compare(password,user.password);

        if (!passwordComparison){
            return res.status(403).json({message:errorMessage,success:false})
        }

        const jwtToken = jwt.sign(
            {
                email:user.email,_id:user._id
            },

            process.env.JWT_SECRET,
            {
                expiresIn:'1h'
            }
        )


        const otp = Math.floor(1000 + Math.random() * 9000);
        otpStore.set(email, otp);


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
            subject: 'Password Reset OTP',
            text:`Your OTP for Two Factor Authentication to login to account is ${otp}. This OTP will expire in 5 minutes.`

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {

                console.log(error);
                return res.status(500).json({
                    message: "Failed to send OTP email",
                    success: false
                
                });
            } else {

                setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);
            }
        });

        res.status(200).json({
            message:"Access Granted",
            success:true,
            jwtToken,
            email,
            name:user.name
        })

    } catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}


const verifyOtp = async (req, res, next) => {
    const { currentUser, otp } = req.body;
    const storedOtp = otpStore.get(currentUser);

    if (!storedOtp || storedOtp !== parseInt(otp, 10)) {
        return res.status(400).json({
            message: "Invalid or expired OTP",
            success: false
        });
    }

    otpStore.delete(currentUser);

    res.status(200).json({
        message: "OTP verified successfully",
        success: true
    });

    next();
};

module.exports = {
    signup,
    login,
    verifyOtp
}