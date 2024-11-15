const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req,res,next)=>{

    const auth = req.headers['authorization'];

    if(auth=='null'){


        return next(new Error('Unauthorized'));
        // res.status(403).json({message:'Unauthorized'});
    }

    else{

        try{

            const decoded = jwt.verify(auth,process.env.PRODUCTS_SECRET);
    
            req.user = decoded;
    
            next();
    
    
        }catch(err){
    
  
            next(new Error('TOKEN IS EXPIRED'));
            // return res.status(403).json({
            //     message:'TOKEN IS EXPIRED'
            // })
        }

    }
    


};

module.exports = ensureAuthenticated;