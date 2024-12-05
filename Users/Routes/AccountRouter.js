const express = require("express");
const router = express.Router();

const ensureAuthorized = require('../Middlewares/Authorization');
const deleteUserById = require('../Controllers/UserAccountController');

router.delete('/delete/:email',ensureAuthorized,deleteUserById);

module.exports = router;



