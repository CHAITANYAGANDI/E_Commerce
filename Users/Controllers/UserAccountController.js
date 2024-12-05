const UserModel = require("../Models/User");


const deleteUserById = async (req, res) => {

    const { email } = req.params;
  
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      await UserModel.deleteOne({ email });
      res.status(200).json({ message: `Customer with ID ${email} deleted successfully.` });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user.' });
    }
  };

  module.exports = deleteUserById;