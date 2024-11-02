const express = require("express");
const router = express.Router();
const {forgotPassword, resetPassword, verifyOtp} = require('../Services/forgotPassword');



router.post('/forgotpassword',forgotPassword);

router.post('/resetpassword',resetPassword);

router.post('/verifyotp',verifyOtp);

module.exports = router;