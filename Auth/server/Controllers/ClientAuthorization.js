const jwt = require('jsonwebtoken');
const CredentialModel = require('../Models/credentials');

const ClientModel = require('../Models/clients');

const axios  = require('axios');

const clientAuthorization = async (req, res) => {

    const { clientId, clientSecret, redirectUri, username } = req.body;

    try {

        const client = await ClientModel.findOne({username:username});

        const creds = await CredentialModel.find({
            client: client._id,
            client_id: clientId,
            client_secret:clientSecret,
            redirect_uri: redirectUri
          });
          
        if (!client&&!creds) {
            return res.status(404).json({ success: false, message: 'Invalid client credentials' });
        }

        

        const token = jwt.sign({ client_name:client.name, client_id: creds[0].client_id, api_url: creds[0].api_url,api_name: creds[0].api_name }, creds[0].secret_key, { expiresIn: '30d' });

        const callback_response = await axios.post(redirectUri,{creds:creds,accessToken:token});

        res.status(200).json({
            success: callback_response.data.success,
            message:callback_response.data.message
 
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred during authorization',
            error: error.message
        });
    }
};

module.exports = clientAuthorization;
