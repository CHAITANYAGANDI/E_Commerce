const mongoose = require('mongoose');
const { Schema } = mongoose;

const credentialSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'clients',
        required: true
    },
    api_name: {
        type: String,
        required: true,
        unique:true
    },
    api_url: {
        type: String,
        required: true
    },
    redirect_uri: {
        type: String,
        required: true
    },
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
    secret_key:{
        type: String,
        required:true,
        unique:true
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
});

const CredentialModel = mongoose.model('credentials', credentialSchema);

module.exports = CredentialModel;
