


const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req,res,next)=>{

    const auth = req.headers['inventoryauthorization'];

    if(auth=='null'){


        return next(new Error('Unauthorized'));
        // res.status(403).json({message:'Unauthorized'});
    }

    else{

        try{

            const decoded = jwt.verify(auth,process.env.INVENTORY_SECRET);
    
            req.inventory = decoded;

            console.log(decoded);

            const originalUrl = req.headers['x-original-url'];

            if (originalUrl.includes(decoded.api_url)){

                next();

            }
            else{

                return res.status(403).json({ error: 'Invalid API URL. Access denied.' });

            }
    
    
        }catch(err){
    
  
            next(new Error('TOKEN IS EXPIRED'));
            // return res.status(403).json({
            //     message:'TOKEN IS EXPIRED'
            // })
        }

    }
    


};

module.exports = ensureAuthenticated;