const ProductsModel = require('../Models/products');

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


    res.status(200).json({
      product
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details.", error });
  }
};


exports.postProductDetails = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      brand, 
      category, 
      features, 
      soldBy, 
      imageUrl, 
      inventory 
    } = req.body;

    // Validate required fields
    if (
      !name || 
      !price || 
      !category || 
      !imageUrl || 
      inventory?.stock < 0 ||     
      !inventory?.supplier
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Set inStock based on inventory.stock
    const inStock = inventory.stock > 0;

    // Construct the product document
    const product = {
      name,
      description,
      price,
      brand,
      category,
      features,
      soldBy,
      imageUrl,
      inventory: {
        stock: inventory.stock,
        supplier: inventory.supplier,
        lastUpdated: inventory.lastUpdated || new Date().toISOString()
      },
      isActive: true, // Default to active when creating a new product
      inStock // Dynamically calculated
    };

    // Insert the product into the database
    const savedProduct = await ProductsModel.create(product);

    console.log(savedProduct);

    // Respond with the created product
    return res.status(201).json({
      message: "Product created successfully.",
      product: savedProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
