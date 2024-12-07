const OrderModel = require('../Models/Order'); 
const crypto = require('crypto');

const getOrderItems = async (req, res) => {
  try {

    const { userId } = req.params;

    const orders = await OrderModel.find({ userId })
      .populate('address_id') 
      .populate('items_id')   
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json({
      orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders.", error });
  }
};

const postOrderDetails = async (req, res) => {
  try {
    const { userId, userAddress, items, total } = req.body;

    const itemIds = items.map(item => item._id);

    const addressIds = userAddress.map(addr => addr._id);

    const orderNumber = crypto.randomInt(10000000, 100000000);

    const orderDetails = {
        orderNumber:orderNumber,
        userId: userId,
        items_id: itemIds,     
        address_id: addressIds, 
        total: total,
        createdAt: new Date()
      };
  
      
      const savedOrder = await OrderModel.findOneAndUpdate(
        { userId: userId },    
        orderDetails,         
        { new: true, upsert: true }
      );
  
      res.status(201).json({
        success: true,
        message: "Order placed/updated successfully.",
        order: savedOrder,
      });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order.", error });
  }
};

module.exports = {getOrderItems,postOrderDetails}