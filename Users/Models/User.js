const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    role: {
      type: String,
      enum: ['Admin', 'Customer'], 
      default: 'Customer',
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);


userSchema.pre('save', async function (next) {
 
  if (this.isGoogleUser && !this.createdAt) {
    this.createdAt = new Date();
  }

  if (this.isModified('password')) {
    this.updatedAt = new Date();
  }

  next();
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
