
const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique:true
  },
  address_id: [{
    type: Schema.Types.ObjectId,
    ref: 'address',
    required: true,
  }],
  items_id: [{
    type: Schema.Types.ObjectId,
    ref: 'cart',
    required: true,
  }],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
