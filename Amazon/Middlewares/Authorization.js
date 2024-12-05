const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req,res,next)=>{

    const auth = req.headers['productsauthorization'];

    if(auth=='null'){

        res.status(403).json({ "message": "Authorization header is missing or invalid. Please provide a valid token." });
    }

    else{

        try{

            const decoded = jwt.verify(auth,process.env.PRODUCTS_SECRET);
    
            req.products = decoded;

            // const originalUrl = req.headers['x-original-url'];
            // console.log('Gateway URL:', originalUrl); // This will show http://localhost:7000/api/products/get

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
    
            return res.status(403).json({
                message:'TOKEN IS EXPIRED'
            })
        }

    }
    
};

module.exports = ensureAuthenticated;