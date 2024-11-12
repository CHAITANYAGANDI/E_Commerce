const bcrypt = require('bcryptjs');
const AdminModel = require("../Models/admins");

const register = async (req,res) =>{
    try {
        const {name, adminname, password} = req.body;

        const admin = await AdminModel.findOne({adminname});

        if (admin){

            return res.status(409).json({
                message: "this admin already exists", success:false
            });

        }

        const adminModel = new AdminModel({name, adminname, password});
        const salt = await bcrypt.genSalt(10);
        adminModel.password = await bcrypt.hash(password,salt);

        await adminModel.save();

        res.status(201).json({
            message: "Admin Registered Successfully",
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

module.exports = register;

