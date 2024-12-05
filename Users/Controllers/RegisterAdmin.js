const bcrypt = require('bcryptjs');
const UserModel = require("../Models/User");


const register = async (req,res) =>{
    try {
        const {name, adminId, password} = req.body;


        const admin = await UserModel.findOne({email:adminId});

        if (admin){

            return res.status(409).json({
                message: "this admin already exists", success:false
            });

        }

        const adminModel = new UserModel({name, email:adminId, password, role:'Admin'});
        const salt = await bcrypt.genSalt(10);
        adminModel.password = await bcrypt.hash(password,salt);

        await adminModel.save();

        res.status(201).json({
            message: "Admin Registered Successfully",
            success:true
        })

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Internal server error",
            success:false
        })

    }
}

module.exports = register;

