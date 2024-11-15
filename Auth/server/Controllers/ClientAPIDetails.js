const CredentialModel = require('../Models/credentials');

const getAPIDetails = async (req, res) => {

    try {

        const { id } = req.params;

        const credential = await CredentialModel.findById(id);

        if (!credential) {
            return res.status(404).json({
                success: false,
                message: 'Credential not found'
            });
        }

        res.status(200).json({
            success: true,
            credential: {
                api_name: credential.api_name,
                api_url: credential.api_url,
                redirect_uri: credential.redirect_uri,
                client_id: credential.client_id,
                client_secret: credential.client_secret,
                creation_date: credential.creation_date,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching credential details',
            error: error.message
        });
    }
};

module.exports = getAPIDetails;
