const bcrypt = require('bcryptjs');
const AdminModel = require("../Models/admins");
const jwt = require('jsonwebtoken');


const login = async (req,res) => {

    try{

        const {adminname,password} = req.body;

        const admin = await AdminModel.findOne({adminname});

        const errorMessage = 'Invalid Credentials';


        if(!admin){

            return res.status(403).json({message:errorMessage,success:false});

        }

        const passwordComparison = await bcrypt.compare(password,admin.password);

        if (!passwordComparison){
            return res.status(403).json({message:errorMessage,success:false})
        }

        const jwtToken = jwt.sign(
            {
                adminname:admin.adminname,_id:admin._id
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
            adminname:admin.adminname
        })

    } catch(err){

        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
};


module.exports = login;