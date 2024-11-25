const ensureAuthenticated = require('../Middlewares/Authorization');

const { getAllProductDetails, getProductDetails, postProductDetails } = require('../Controller/productController');

const express = require("express");
const router = express.Router();


// router.get('/',ensureAuthenticated,(req,res)=>{

//     res.status(200).json([
//         {
//             name:"mobile",
//             price:10000
//         },
//         {
//             name:'tv',
//             price:20000
//         }

//     ])

// });

router.get('/get', ensureAuthenticated,getAllProductDetails);

router.get('/:productId', ensureAuthenticated,getProductDetails);

router.post('/add', ensureAuthenticated,postProductDetails);

module.exports = router;
