const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique:true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  countryRegion: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  }
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   ref: 'User' // Assuming you have a 'User' model to reference
  // }
});

const Address = mongoose.model('address', addressSchema);

module.exports = Address;
