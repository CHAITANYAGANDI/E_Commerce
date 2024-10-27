const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req,res,next)=>{

    const auth = req.headers['authorization'];

    if(!auth){
        return res.status(403).json({message:'Unauthorized'});
    }

    try{

        const decoded = jwt.verify(auth,process.env.JWT_SECRET);

        req.user = decoded;

        console.log(req.user);

        next();


    }catch(err){
        return res.status(403).json({
            message:'TOKEN IS EXPIRED'
        })
    }
};

module.exports = ensureAuthenticated;