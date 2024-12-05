const axios = require('axios');
const ClientsModel = require('../Models/clients');

const authenticate=  async(req,res) =>{

    try{

        const { username } = req.body;

        const retrievedDoc = await ClientsModel.findOne({});

        if (retrievedDoc) {
            const { client_id, client_secret, redirect_uri } = retrievedDoc;
            formattedDoc = {
                clientId: client_id,
                clientSecret: client_secret,
                redirectUri: redirect_uri
            };
            
            await ClientsModel.deleteOne({ _id: retrievedDoc._id });

        } 

        const {clientId,clientSecret,redirectUri} = formattedDoc;

        const response = await axios.post('http://localhost:5000/auth/authorize',
             
            { clientId,clientSecret,redirectUri,username }, 

            {
                headers: {

                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json({
            success:response.data.success,
            message:response.data.message
        });


    }catch (err){

        console.error('Error during authentication:', err.message);

        if (err.response) {

            return res.status(err.response.status || 500).json({
                success: false,
                message: `Authorization service error: ${err.response.data.message || 'An error occurred'}`,
                error: err.response.data,
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred during authentication',
            error: err.message,
        });
    }
    

}

module.exports = authenticate;