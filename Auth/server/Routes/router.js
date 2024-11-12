const express = require("express");
const router = express.Router();

const register = require('../Controllers/RegisterClient');

const login = require('../Controllers/LoginClient');

const clientAPIDetails = require('../Controllers/ClientAPIDetails');

const clientAuthorization = require('../Controllers/ClientAuthorization');

const createCredential = require('../Services/createCredential');

const getCredentials = require('../Services/getCredentials');

const {signupValidation,loginvalidation} = require('../Middlewares/clientCredsValidation');

const verifyToken = require("../Middlewares/verifyToken");

const renderLoginPage = require('../Controllers/RenderLoginPage');

const loginClients = require('../Controllers/LoginClients');



router.get('/client/login',renderLoginPage);

router.post('/login',loginvalidation,login);

router.post('/client/login',loginClients);

router.post('/register',signupValidation,register);

router.post('/credentials',verifyToken,createCredential);

router.get('/dashboard', verifyToken, getCredentials);

router.get('/creds/apiinfo/:id',verifyToken,clientAPIDetails);

router.post('/token',verifyToken,clientAuthorization);

router.post('/authorize',clientAuthorization);


module.exports = router;



