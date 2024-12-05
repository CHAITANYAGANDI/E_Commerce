const ensureAuthorized = require('../Middlewares/Authorization');

const {getOrderItems,postOrderDetails}  = require('../Controllers/OrderController');

const express = require("express");
const router = express.Router();


router.get('/get/:userId', ensureAuthorized,getOrderItems);

router.post('/add',ensureAuthorized,postOrderDetails);

module.exports = router;
