const bcrypt = require('bcryptjs');
const ClientModel = require("../Models/clients");
const jwt = require('jsonwebtoken');


const login = async (req,res) => {

    try{

        const {username,password} = req.body;

        const client = await ClientModel.findOne({username});
  
        const errorMessage = 'Invalid Credentials';

        if(!client){

            return res.status(403).json({message:errorMessage,success:false});

        }

        const passwordComparison = await bcrypt.compare(password,client.password);

        if (!passwordComparison){
            return res.status(403).json({message:errorMessage,success:false})
        }

        const jwtToken = jwt.sign(
            {
                username:client.username,_id:client._id
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
            username:client.username
        })

    } catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
};


module.exports = login;