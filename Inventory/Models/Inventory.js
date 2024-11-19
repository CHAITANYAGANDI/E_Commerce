const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});


const InventoryModel = mongoose.model('Inventory', InventorySchema);

module.exports = InventoryModel;
