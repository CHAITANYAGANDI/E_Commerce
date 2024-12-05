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

const token = require('../Controllers/token');

const {getAllUsers,deleteUserById}  = require('../Controllers/UserController');



router.post('/login',loginvalidation,loginAdmin);

router.post('/register',signupValidation,registerAdmin);

router.post('/auth',verifyToken,authenticate);

router.get('/client/creds',verifyToken,getCreds);

router.post('/auth/callback',auth);

router.post('/client/details',verifyToken,clientData);

router.get('/token',verifyToken,token);

router.get('/users/get',verifyToken,getAllUsers);

router.delete('/users/delete/:userId',verifyToken,deleteUserById);


module.exports = router;



