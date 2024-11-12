const ClientsModel = require('../Models/clients');

const clientData = async (req, res) => {
    console.log(req.body, 'coming from the client data');
    
    const { clientId, clientSecret, redirectUri } = req.body;
    
    try {
        // Check if there is already a document in the collection
        const docCount = await ClientsModel.countDocuments();
        
        if (docCount === 0) {
            // Only insert if the collection is empty
            const clientsModel = new ClientsModel({
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri
            });
            
            await clientsModel.save();
            res.status(201).json({ message: 'Client data saved successfully' });
        } else {
            // If a document already exists, throw an error
            res.status(400).json({ error: 'Collection already contains a document. Only one document allowed.' });
        }
    } catch (error) {
        console.error('Error saving client data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = clientData;
