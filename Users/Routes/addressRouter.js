const ensureAuthorized = require('../Middlewares/Authorization');
const {getUserAddresses,addUserAddress}  = require('../Controllers/AddressController');

const express = require("express");
const router = express.Router();

router.get('/get/:userId', ensureAuthorized,getUserAddresses);
router.post('/add',ensureAuthorized,addUserAddress);

module.exports = router;
