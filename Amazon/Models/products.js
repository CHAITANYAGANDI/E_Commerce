const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
      type: [String], 
      required: true,
    },
    soldBy: {
      type: String,
      required: true,
      trim: true,
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
        type: String, 
        required: true,
        trim: true,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
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
    timestamps: true,
  }
);


ProductSchema.index({ name: 1, brand: 1, soldBy: 1 }, { unique: true });

const ProductsModel = mongoose.model('Products', ProductSchema);

module.exports = ProductsModel;


  