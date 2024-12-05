const express = require("express");
const router = express.Router();

const {signup,login} = require('../Controllers/AuthController');

const verifyOtp = require('../Middlewares/verifyOtp');

const {signupValidation,loginvalidation} = require('../Middlewares/userCredsValidation');


router.post('/login',loginvalidation,login);

router.post('/signup',signupValidation,signup);

router.post('/verifyotp',verifyOtp);

module.exports = router;


