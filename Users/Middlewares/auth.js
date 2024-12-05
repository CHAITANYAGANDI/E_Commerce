const CredsModel = require("../Models/creds");

const auth = async (req,res) =>{

    try{

        const { creds, accessToken } = req.body;

        if (!accessToken) {
            
            return res.status(400).json({ success: false, message: 'Access token is missing' });
        }

        creds.forEach(async (cred) => {
            try {
               
                const existingCred = await CredsModel.findOne({ api_name: cred.api_name });
                
                if (existingCred) {
                    
                    existingCred.access_token = accessToken;
                    await existingCred.save();
                } else {
                    
                    const newCreds = new CredsModel({
                        client_id: cred.client_id,
                        api_name: cred.api_name,
                        api_url: cred.api_url,
                        access_token: accessToken
                    });
                    await newCreds.save();
                }


            } catch (error) {
                console.error('Error processing credentials:', error);
                return res.status(500).json({
                    success: false,
                    message: `Failed to process credential for API: ${cred.api_name}`
                });
            }
        });

        res.status(200).json({
            success: true,
            message: 'Access token received successfully'

        });

    }catch(err){

        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while processing the request'
        });
    }

}

module.exports = auth;