const UserModel = require("../Models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { name: 1,email:1,role:1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};


const deleteUserById = async (req, res) => {

  const { userId } = req.params;

  try {
    const user = await UserModel.findOne({ email:userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ message: 'You can only delete admin users.' });
    }

    await UserModel.deleteOne({ email:userId });
    res.status(200).json({ message: `Admin user with ID ${userId} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};


module.exports = {getAllUsers,deleteUserById}