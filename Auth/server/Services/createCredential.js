const CredentialModel = require('../Models/credentials');

const { generateUniqueId, generateUniqueSecret } = require('../utils/generateUniqueIdentifiers');

const createCredential = async (req, res) => {

    const { api_name, api_url, redirect_uri, secret_key } = req.body;

    if (!req.clientId) return res.status(400).json({ message: 'Client ID not found' });


    const client_id = generateUniqueId();
    const client_secret = generateUniqueSecret();

    const newCredential = new CredentialModel({
        client: req.clientId,
        api_name,
        api_url,
        redirect_uri,
        client_id,
        client_secret,
        secret_key,
        creation_date: new Date()
    });

    await newCredential.save();

    res.json({ success: true, message: 'Credentials created successfully', credential: newCredential });
};



module.exports = createCredential;
