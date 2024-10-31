const ensureAuthenticated = require('../Middlewares/Authorization');
const ensuregoogleAuthenticated = require('../Middlewares/googleAuthorization');
const express = require("express");
const router = express.Router();


const ensureEitherAuthenticated = (req, res, next) => {

         ensureAuthenticated(req, res, (jwtError) => {

        
        if (!jwtError) {
    
            return next();
        } else {

            ensuregoogleAuthenticated(req, res, (googleError) => {
                if (!googleError) {

                    return next();
                } else {

                    return res.status(403).json({ message: 'Unauthorized: Both tokens invalid' });
                }
            });
        }
    });
};

router.get('/',ensureEitherAuthenticated,(req,res)=>{

    res.status(200).json([
        {name:"mobile",
        price:10000},
        {
            name:'tv',
            price:20000
        }

    ])

});


module.exports = router;