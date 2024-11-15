const express = require("express");
const router = express.Router();

const registerAdmin = require('../Controllers/RegisterAdmin');

const loginAdmin = require('../Controllers/LoginAdmin');

const {signupValidation,loginvalidation} = require('../Middlewares/adminCredsValidation');

const verifyToken = require("../Middlewares/verifyToken");

const authenticate = require('../Middlewares/authenticate');

const auth = require('../Middlewares/auth');

const getCreds = require('../Controllers/getCreds');

const clientData = require('../Controllers/clientData');




router.post('/login',loginvalidation,loginAdmin);

router.post('/register',signupValidation,registerAdmin);

router.post('/auth',authenticate);

router.get('/client/creds',getCreds);

router.post('/auth/callback',auth);

router.post('/client/details',clientData);


module.exports = router;



