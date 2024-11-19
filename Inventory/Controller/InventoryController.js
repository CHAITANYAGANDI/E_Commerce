const InventoryModel = require('../Models/Inventory');


exports.updateInventory = async (req, res) => {

  try {

    const { productId, quantity } = req.body;


    const inventory = await InventoryModel.findOne({ productId });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found for the given product." });
    }

    inventory.quantity = quantity;
    inventory.lastUpdated = Date.now();

    await inventory.save();

    res.status(200).json({ message: "Inventory updated successfully.", inventory });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory.", error });
  }

};


exports.getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await InventoryModel.findOne({ productId });

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found for the given product." });
    }

    res.status(200).json({ inventory });
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory.", error });
  }
};


exports.postInventory = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
  

      if (!productId || quantity === undefined) {
        return res.status(400).json({ message: 'Product ID and quantity are required.' });
      }
  

      const existingInventory = await InventoryModel.findOne({ productId });
  
      if (existingInventory) {
        return res.status(400).json({ message: 'Inventory record already exists for this product.' });
      }


      const newInventory = new InventoryModel({
        productId,
        quantity,
        lastUpdated: Date.now()
      });
  
      const savedInventory = await newInventory.save();
  
      res.status(201).json({
        message: 'Inventory created successfully.',
        inventory: savedInventory
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating inventory.',
        error: error.message
      });
    }
  };