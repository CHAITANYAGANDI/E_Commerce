const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new Schema({

    client_id: {
        type: String,
        required: true,
        unique: true
    },
    client_secret: {
        type: String,
        required: true,
        unique:true
    },
    redirect_uri: {
        type: String,
        required: true
    }
    
});

const ClientModel = mongoose.model('temp_clients', clientSchema);

module.exports = ClientModel;
