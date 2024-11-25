const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const ProductSchema = new Schema({
//   name: { type: String, required: true },
//   description: String,
//   price: { type: Number, required: true },
//   brand: { type: String, required: true },
//   category: String,
//   features: { type: [String], default: [] },
//   inStock: { type: Boolean, default: true },
//   stockStatus: { type: String, default: 'In Stock' },
//   soldBy: { type: String, required: true },
//   imageUrl: { type: String, required: true }
// });


// const mongoose = require('mongoose');

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    features: {
      type: [String], // Array to store feature descriptions
      required: true,
    },
    soldBy: {
      type: String,
      required: true,
      trim: true, // Seller information
    },
    imageUrl: {
      type: String,
      required: true,
    },
    inventory: {
      stock: {
        type: Number,
        required: true,
      },
      supplier: {
        type: String, // Supplier information for the product
        required: true,
        trim: true,
      },
      lastUpdated: {
        type: Date, // Timestamp of when the inventory was last updated
        default: Date.now,
      },
    },
    isActive: {
      type: Boolean,
      default: true, // Mark whether the product is active or discontinued.
    },
    inStock: 
    { type: Boolean, 
      default: true 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`.
  }
);


ProductSchema.index({ name: 1, brand: 1, soldBy: 1 }, { unique: true });

const ProductsModel = mongoose.model('Products', ProductSchema);

module.exports = ProductsModel;


  