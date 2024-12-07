const express = require("express");
const router = express.Router();

const registerAdmin = require('../Controllers/RegisterAdmin');

const loginAdmin = require('../Controllers/LoginAdmin');

const {signupValidation,loginvalidation} = require('../Middlewares/adminCredsValidation');

const ensureAuthorized = require('../Middlewares/Authorization');

const authenticate = require('../Middlewares/authenticate');

const auth = require('../Middlewares/auth');

const getCreds = require('../Controllers/getCreds');

const clientData = require('../Controllers/clientData');

const token = require('../Controllers/token');

const {getAllUsers,deleteUserById}  = require('../Controllers/UserController');



router.post('/login',loginvalidation,loginAdmin);

router.post('/register',signupValidation,ensureAuthorized,registerAdmin);

router.post('/auth',ensureAuthorized,authenticate);

router.get('/client/creds',ensureAuthorized,getCreds);

router.post('/auth/callback',auth);

router.post('/client/details',ensureAuthorized,clientData);

router.get('/token',ensureAuthorized,token);

router.get('/users/get',ensureAuthorized,getAllUsers);

router.delete('/users/delete/:userId',ensureAuthorized,deleteUserById);


module.exports = router;



