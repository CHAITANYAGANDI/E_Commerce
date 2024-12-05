const bcrypt = require('bcryptjs');
const UserModel = require("../Models/User");

const jwt = require('jsonwebtoken');


const login = async (req,res) => {

    try{

        const {adminId,password} = req.body;

        const admin = await UserModel.findOne({email:adminId});

        const errorMessage = 'Invalid Credentials';


        if(!admin||admin.role!='Admin'){

            return res.status(403).json({message:errorMessage,success:false});

        }

        const passwordComparison = await bcrypt.compare(password,admin.password);

        if (!passwordComparison){
            return res.status(403).json({message:errorMessage,success:false})
        }

        const jwtToken = jwt.sign(
            {
                adminId:admin.email,_id:admin._id
            },

            process.env.JWT_SECRET,
            {
                expiresIn:'1h'
            }
        )

        res.status(200).json({
            message:"Access Granted",
            success:true,
            jwtToken,
            adminId:admin.email
        })

    } catch(err){

        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
};


module.exports = login;