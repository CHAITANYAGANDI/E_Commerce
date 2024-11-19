// routes/inventoryRoutes.js
const express = require('express');
const { updateInventory, getInventoryByProduct,postInventory } = require('../Controller/InventoryController');
const ensureAuthenticated = require('../Middlewares/Authorization');


const router = express.Router();


router.put('/update', updateInventory);

router.get('/:productId', getInventoryByProduct);

router.post('/add', ensureAuthenticated,postInventory);

module.exports = router;
