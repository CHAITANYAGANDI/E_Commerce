const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const googleUserSchema = new Schema({
    
    name:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required: true,
        unique: true
    },

})


const GoogleUserModel = mongoose.model('Google_Users',googleUserSchema);

module.exports = GoogleUserModel;
