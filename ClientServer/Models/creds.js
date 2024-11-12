const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const credsSchema = new Schema({

    api_name: {
        type: String,
        required: true,
        unique:true
    },
    api_url: {
        type: String,
        required: true
    },

    access_token: {
        type: String,
        required: true,
        unique:true
    }
})


const CredsModel = mongoose.model('creds',credsSchema);

module.exports = CredsModel;
