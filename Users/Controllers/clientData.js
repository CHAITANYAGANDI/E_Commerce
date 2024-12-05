const ClientsModel = require('../Models/clients');

const clientData = async (req, res) => {

    const { clientId, clientSecret, redirectUri } = req.body;
    
    try {
 
        const docCount = await ClientsModel.countDocuments();
        
        if (docCount === 0) {
      
            const clientsModel = new ClientsModel({
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri
            });
            
            await clientsModel.save();
            res.status(201).json({ message: 'Client data saved successfully' });
        } else {
      
            res.status(400).json({ error: 'Collection already contains a document. Only one document allowed.' });
        }
    } catch (error) {
        console.error('Error saving client data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = clientData;
