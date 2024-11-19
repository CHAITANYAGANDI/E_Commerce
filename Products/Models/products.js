const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    inStock: { type: Boolean, default: true },
    imageUrl: { type: String, required: true }
  });
  
const ProductsModel = mongoose.model('Products', ProductSchema);

module.exports = ProductsModel;

  