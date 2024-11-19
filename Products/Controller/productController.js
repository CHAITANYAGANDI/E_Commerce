const ProductsModel = require('../Models/products');
const axios = require('axios');

const INVENTORY_SERVICE_URL = 'http://localhost:7000/api/inventory';

exports.getAllProductDetails = async (req, res) => {
    try {
    
      const products = await ProductsModel.find();
  
      if (!products.length) {
        return res.status(404).json({ message: "No products found." });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products.", error });
    }
  };

  
exports.getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await ProductsModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }


    const inventoryResponse = await axios.get(`${INVENTORY_SERVICE_URL}/${productId}`);
    const inventory = inventoryResponse.data.inventory;

    res.status(200).json({
      product,
      inventory: {
        quantity: inventory.quantity,
        inStock: inventory.quantity > 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details.", error });
  }
};


exports.postProductDetails = async (req, res) => {

    const inventory_access_token = req.headers['inventoryauthorization'];

    
    try {
      const { name, description, price, category, imageUrl, quantity } = req.body;

      console.log(req.body);
  
      if (!name || !price || !category || !imageUrl || quantity === undefined) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  

      const newProduct = new ProductsModel({
        name,
        description,
        price,
        category,
        imageUrl,
        inStock: quantity > 0 
      });
  
      const savedProduct = await newProduct.save();
  

      const inventoryPayload = {
        productId: savedProduct._id,
        quantity
      };
  
      const inventoryResponse = await axios.post(`${INVENTORY_SERVICE_URL}/add`, inventoryPayload,{
        headers: {
          "InventoryAuthorization": inventory_access_token, // Use Bearer token format
        },
      });


      console.log(inventoryResponse);
  
      if (inventoryResponse.status !== 201) {
        return res.status(500).json({ message: "Failed to create inventory entry.", error: inventoryResponse.data });
      }
  
      res.status(201).json({
        message: "Product created successfully and linked to inventory.",
        product: savedProduct,
        inventory: inventoryResponse.data.inventory
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating product.", error });
    }
  };
