const CartModel = require('../Models/Cart');

const getCartItems = async (req, res) => {
    try {

      const { userId } = req.params;

      const cartItems = await CartModel.find({ userId });
  
      if (cartItems.length === 0) {
        return res.status(404).json({ message: "No items found in the cart." });
      }
  
      res.status(200).json({
        cartItems
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Error fetching cart items.", error });
    }
  };



const postCartDetails = async (req, res) => {
    try {

      const {
        userId,
        productName,
        productDescription,
        productImageUrl,
        productPrice,
        productQuantity,
        productSoldBy,
      } = req.body;
  
      if (
        !userId ||
        !productName ||
        !productPrice ||
        !productImageUrl ||
        !productQuantity ||
        !productSoldBy
      ) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      if (productQuantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than zero." });
      }

      const existingCartItem = await CartModel.findOne({ userId, productName });
  
      if (existingCartItem) {

        return res.status(200).json({
          success: true,
          message: "Product already exists in the cart.",
          cartItem: existingCartItem,
        });
        
      }

      else{

        const cartItem = {
          userId,
          productName,
          productDescription,
          productImageUrl,
          productPrice,
          productQuantity,
          productSoldBy,
        };
    
  
        const savedCartItem = await CartModel.create(cartItem);
  
        return res.status(201).json({
          success: true,
          message: "Product added to cart successfully.",
          cartItem: savedCartItem,
        });

      }
  
  
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  

const updateCartItem = async (req, res) => {
    try {

      const { userId, productName, productQuantity } = req.body;
  
      if (!userId || !productName || productQuantity === undefined) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: userId, productName, and productQuantity.",
        });
      }
  
      if (productQuantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be greater than zero.",
        });
      }
  
      const cartItem = await CartModel.findOne({ userId, productName });
  
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found.",
        });
      }
  
      cartItem.productQuantity = productQuantity;
      const updatedCartItem = await cartItem.save();
  
      return res.status(200).json({
        success: true,
        message: "Cart item updated successfully.",
        cartItem: updatedCartItem,
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  

const removeCartItem = async (req, res) => {
    try {

      const { userId, productName } = req.body;

      if (!userId || !productName) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: userId and productName.",
        });
      }
  
      const deletedItem = await CartModel.findOneAndDelete({ userId, productName });
  
      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Cart item removed successfully.",
        deletedItem,
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  

  module.exports = {getCartItems,postCartDetails,updateCartItem,removeCartItem}