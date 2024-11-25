const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req,res,next)=>{

    const auth = req.headers['productsauthorization'];

    if(auth=='null'){


        return next(new Error('Unauthorized'));
        // res.status(403).json({message:'Unauthorized'});
    }

    else{

        try{

            const decoded = jwt.verify(auth,process.env.PRODUCTS_SECRET);
    
            req.products = decoded;

            console.log(decoded);

            // const originalUrl = req.headers['x-original-url'];
            // console.log('Gateway URL:', originalUrl); // This will show http://localhost:7000/api/products/get

            // // If you still need the internal URL for some reason
            // const internalUrl = `${req.protocol}://${req.get('host')}${req.url}`;
            // console.log('Internal URL:', internalUrl); // This will show http://localhost:7003/get

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