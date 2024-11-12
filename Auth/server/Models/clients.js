const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name:{
        type:String,
        required:true,
    },

    username:{
        type:String,
        required: true,
        unique: true
    },

    password:{
        type:String,
        required:true,
    }
})

const ClientModel = mongoose.model('clients',clientSchema);

module.exports = ClientModel;
