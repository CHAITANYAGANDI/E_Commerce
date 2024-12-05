const ensureAuthenticated = require('../Middlewares/Authorization');

const { getAllProductDetails, getProductDetails, postProductDetails } = require('../Controller/productController');

const express = require("express");
const router = express.Router();


router.get('/get', ensureAuthenticated,getAllProductDetails);

router.get('/:productId', ensureAuthenticated,getProductDetails);

router.post('/add', ensureAuthenticated,postProductDetails);

module.exports = router;
