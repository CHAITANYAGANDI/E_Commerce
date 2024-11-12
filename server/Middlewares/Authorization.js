const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req,res,next)=>{

    const auth = req.headers['authorization'];

    console.log(req.headers);

    if(auth=='null'){


        return next(new Error('Unauthorized'));
        // res.status(403).json({message:'Unauthorized'});
    }

    else{

        try{

            const decoded = jwt.verify(auth,process.env.PRODUCTS_SECRET);
    
            req.user = decoded;
    
            console.log(req.user);
    
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