const AddressModel = require('../Models/Address');

const getUserAddresses = async (req, res) => {
  try {

    const { userId } = req.params;

    const addresses = await AddressModel.find({ userId });

    if (addresses.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No addresses found for the user.",
      });
    }
    else{

        res.status(200).json({
            success: true,
            addresses,
          });
    }

   
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses.",
      error,
    });
  }
};

const addUserAddress = async (req, res) => {
  try {

    const { userId, fullName, phoneNumber, address, countryRegion, city, province, postalCode } = req.body;

    if (!userId || !fullName || !phoneNumber || !address || !countryRegion || !city || !province || !postalCode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const existingAddress = await AddressModel.findOne({
      userId,
      address,
      city,
      province,
      postalCode,
    });

    if (existingAddress) {
      return res.status(409).json({
        success: false,
        message: "Address already exists for the user.",
      });
    }

    const newAddress = await AddressModel.create({
      userId,
      fullName,
      phoneNumber,
      address,
      countryRegion,
      city,
      province,
      postalCode,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully.",
      address: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error,
    });
  }
};


module.exports = {getUserAddresses,addUserAddress}