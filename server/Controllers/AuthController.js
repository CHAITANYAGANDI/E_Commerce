const bcrypt = require('bcryptjs');
const UserModel = require("../Models/User");
const jwt = require('jsonwebtoken');

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

        // console.log(user);

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

        // console.log(jwtToken);
        res.status(200).json({
            message:"Access Granted",
            success:true,
            jwtToken,
            email,
            name:user.name
        })

    } catch(err){
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}

module.exports = {
    signup,
    login
}