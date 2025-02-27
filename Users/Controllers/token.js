const CredsModel = require("../Models/creds");

const token = async (req, res) => {
    try {
     
        const { client_id } = req.headers;

        if (!client_id) {
            return res.status(400).json({ success: false, message: 'Client ID is missing' });
        }

        const creds = await CredsModel.findOne({ client_id });

        if (creds.length === 0) {
            return res.status(404).json({ success: false, message: 'No credentials found for this Client ID' });
        }

        res.status(200).json({
            success: true,
            message: 'Credentials fetched successfully',
            data: creds 
        });
    } catch (err) {
        console.error('Error fetching credentials:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = token;
