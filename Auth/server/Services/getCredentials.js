const CredentialModel = require('../Models/credentials');

const getCredentials = async (req, res) => {
    try {
        
        const credentials = await CredentialModel.find({ client: req.clientId })
            .select('api_name creation_date');

        res.json({ success: true, credentials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch credentials' });
    }
};


module.exports = getCredentials;


