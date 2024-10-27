

const express = require("express");
const router = express.Router();

const {signup,login} = require('../Controllers/AuthController');

const {signupValidation,loginvalidation} = require('../Middlewares/AuthValidation');


router.post('/login',loginvalidation,login);

router.post('/signup',signupValidation,signup);


module.exports = router;


