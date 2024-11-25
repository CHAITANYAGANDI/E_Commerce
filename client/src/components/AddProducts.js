
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

import '../AddProducts.css'; // Add appropriate styling here

function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        brand: '',
        category: '',
        features: '',
        soldBy: '',
        imageUrl: '',
        quantity: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogout = () => {
        localStorage.removeItem('AdminToken');
        handleSuccess('Logged out successfully');
        setTimeout(() => {
            navigate('/admin/login');
        }, 1000);
    };

    const handleBack = () => {
        navigate('/admin/products');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const headers = {
            headers: {
                'ProductsAuthorization': localStorage.getItem('ProductsAccessToken'),
                'InventoryAuthorization': localStorage.getItem('InventoryAccessToken'),
                'Content-Type': 'application/json'
            }
        };

        const { name, description, price, brand, category, features, soldBy, imageUrl, quantity } = formData;

        if (!name || !price || !brand || !category || !soldBy || !imageUrl || quantity === '') {
            return handleError('All fields are required.');
        }

        // Split features into an array
        const featuresArray = features.split('\n').map(feature => feature.trim()).filter(Boolean);

        const productPayload = {
            name,
            description,
            price: parseFloat(price),
            brand,
            category,
            features: featuresArray,
            soldBy,
            imageUrl,
            quantity: parseInt(quantity, 10)
        };

        try {
            const response = await fetch('http://localhost:7000/api/products/add', {
                method: 'POST',
                headers: headers.headers,
                body: JSON.stringify(productPayload)
            });

            if (response.ok) {
                const data = await response.json();
                handleSuccess('Product added successfully.');
                console.log('Product response:', data);
                navigate('/admin/products');
            } else {
                const errorData = await response.json();
                handleError(`Failed to add product: ${errorData.message}`);
            }
        } catch (error) {
            handleError('An error occurred while adding the product.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="add-product-container">
            <div className="top-bar">
                <button onClick={handleBack} className="back-button">&#8592; Back</button>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <h3>Add New Product</h3>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Product Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter Product Description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        placeholder="Enter Product Price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        placeholder="Enter Product Brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="Enter Product Category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="features">Features (one per line)</label>
                    <textarea
                        name="features"
                        placeholder="Enter Product Features"
                        value={formData.features}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="soldBy">Sold By</label>
                    <input
                        type="text"
                        name="soldBy"
                        placeholder="Enter Seller Information"
                        value={formData.soldBy}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL</label>
                    <input
                        type="url"
                        name="imageUrl"
                        placeholder="Enter Image URL"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Enter Product Quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
