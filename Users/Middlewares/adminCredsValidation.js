const joi = require('joi');

const signupValidation = (req,res,next)=> {
    
    const schema = joi.object({
        name:joi.string().min(3).max(100).required(),
        adminId:joi.string().min(3).max(100).required(),
        password: joi.string().min(4).max(100).required()
    });

    const {error} = schema.validate(req.body);

    if (error){

        return res.status(400).json({message:"Bad Request",error})
    }

    next();
}


const loginvalidation = (req,res,next)=> {
    
    const schema = joi.object({
        adminId: joi.string().min(4).max(100).required(),
        password: joi.string().min(4).max(100).required()

    });

    const {error} = schema.validate(req.body);

    if (error){
        return res.status(400).json({message:'Bad request',error})


    }
    next();
}


module.exports = {
    signupValidation,
    loginvalidation
}