const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name:{
        type:String,
        required:true,
    },

    adminname:{
        type:String,
        required: true,
        unique: true
    },

    password:{
        type:String,
        required:true,
    }
})


const AdminModel = mongoose.model('admins',adminSchema);

module.exports = AdminModel;
