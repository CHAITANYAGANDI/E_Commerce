const ensureAuthorized = require('../Middlewares/Authorization');

const {getCartItems,postCartDetails,updateCartItem,removeCartItem}  = require('../Controllers/CartController');

const express = require("express");
const router = express.Router();


router.get('/get/:userId', ensureAuthorized,getCartItems);
router.post('/add',ensureAuthorized,postCartDetails);
router.put('/update',ensureAuthorized,updateCartItem);
router.delete('/remove',ensureAuthorized,removeCartItem);


module.exports = router;
