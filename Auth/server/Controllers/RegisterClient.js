const bcrypt = require('bcryptjs');
const ClientModel = require("../Models/clients");


const register = async (req,res) =>{
    try {
        const {name, username, password} = req.body;

        const user = await ClientModel.findOne({username});

        if (user){

            return res.status(409).json({
                message: "this user already exists", success:false
            });

        }

        const clientModel = new ClientModel({name, username, password});
        const salt = await bcrypt.genSalt(10);
        clientModel.password = await bcrypt.hash(password,salt);

        await clientModel.save();

        res.status(201).json({
            message: "Registered Successfully",
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

