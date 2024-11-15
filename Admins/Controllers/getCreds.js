const CredsModel = require('../Models/creds');

const getCreds = async (req, res) => {
    try {
  
        const creds = await CredsModel.find();
        
        if (!creds.length) {
            return res.status(404).json({ success: false, message: 'No credentials found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Credentials retrieved successfully',
            data: creds
        });

    } catch (err) {
        console.error('Error fetching credentials:', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving credentials',
            error: err.message
        });
    }
};

module.exports = getCreds;
