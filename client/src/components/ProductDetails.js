import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { handleError, handleSuccess,handleCartClick } from '../utils';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import {ToastContainer} from 'react-toastify'

import '../ProductDetails.css';
import '../Home.css';

function ProductDetails() {
  const { source, productId } = useParams();
  const [loggedInUser, setLoggedInUser] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const amazonLogoUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
  const walmartLogoUrl = 'https://i5.walmartimages.com/dfw/63fd9f59-b3e1/7a569e53-f29a-4c3d-bfaf-6f7a158bfadd/v1/walmartLogo.svg';

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('UserToken');
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('otpVerificationStatus');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleDeleteAccount = async () => {


    const email = localStorage.getItem('currentUserEmail');
    if (!email) {
      handleError('No user email found');
      return;
    }
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:7000/api/user/account/delete/${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('UserToken'),
        },
      });

      if (response.ok) {
        handleSuccess('Account deleted successfully');
        localStorage.removeItem('UserToken');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('loggedInUser');
        setTimeout(() => {
          navigate('/signup');
        }, 1500);
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to delete account');
      }
    } catch (error) {
      handleError(error.message || 'An error occurred while deleting the account');
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        let url;
        if (source === 'walmart') {
          url = `http://localhost:7000/api/walmart/products/${productId}`;
        } else if (source === 'amazon') {
          url = `http://localhost:7000/api/amazon/products/${productId}`;
        } else {
          throw new Error('Invalid source provided.');
        }

        const headers = {
          'ProductsAuthorization': localStorage.getItem(`${source.charAt(0).toUpperCase() + source.slice(1)}_Products_AccessToken`),
        };

        const response = await fetch(url, { headers });

        if (response.ok) {
          const result = await response.json();
          setProduct(result.product || result);
        } else {
          handleError('Failed to fetch product details.');
        }
      } catch (err) {
        handleError(err.message || 'Error fetching product details.');
      }
    };

    fetchProductDetails();
  }, [source, productId]);

  const handleAddToCart = async () => {
    if (!loggedInUser) {
      handleError('Please log in to add items to the cart.');
      navigate('/login');
      return;
    }
    const userId = localStorage.getItem('currentUserEmail');

    const cartItem = {
      userId:userId,
      productName: product.name,
      productDescription: product.description,
      productImageUrl:product.imageUrl,
      productPrice: product.price,
      productQuantity: quantity,
      productSoldBy:product.soldBy
    };

    console.log(cartItem);

    try {
      const response = await fetch('http://localhost:7000/api/user/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('UserToken'),
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        const Data = await response.json();
        handleSuccess(Data.message);
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to add product to cart.');
      }
    } catch (err) {
      handleError(err.message || 'Error adding product to cart.');
    }
  };

  const handleBuyNow = async() => {
    if (!loggedInUser) {
      handleError('Please log in to buy this product.');
      navigate('/login');
      return;
    }
    
    const userId = localStorage.getItem('currentUserEmail');

    const cartItem = {
      userId: userId,
      productName: product.name,
      productDescription: product.description,
      productImageUrl: product.imageUrl,
      productPrice: product.price,
      productQuantity: quantity,
      productSoldBy: product.soldBy,
    };
  
    try {

      const cartResponse = await fetch('http://localhost:7000/api/user/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('UserToken'),

        },
        body: JSON.stringify(cartItem),
      });

  
      if (!cartResponse.ok) {
        const errorData = await cartResponse.json();
        handleError(errorData.message || 'Failed to add product to cart.');
        return;
      }

      const responseFromCartAPI = await cartResponse.json();

      console.log(responseFromCartAPI.cartItem);
  
      handleSuccess('Product added to cart.');
  
      const addressResponse = await fetch(`http://localhost:7000/api/user/address/get/${userId}`,
        {
          headers: {
            'Authorization': localStorage.getItem('UserToken'),
          }
  
        }
      );
      if (!addressResponse.ok) {
        handleError('Failed to fetch user address.');
        return;
      }
  
      const addressResult = await addressResponse.json();
      const userAddress = addressResult.addresses;
  
      if (!userAddress || userAddress.length === 0) {
        handleError('No addresses found. Redirecting to add a new address.');
        navigate('/address/new');
        return;
      }
  
      const orderData = {
        userId: userId,
        userAddress: userAddress,
        items: [responseFromCartAPI.cartItem],
        total: product.price * quantity,
      };
  
      const orderResponse = await fetch('http://localhost:7000/api/user/order/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('UserToken'),

        },
        body: JSON.stringify(orderData),
      });
  
      if (orderResponse.ok) {
        handleSuccess('Order placed successfully!');
        navigate('/checkout');
      } else {
        const errorData = await orderResponse.json();
        handleError(errorData.message || 'Failed to place order.');
      }
    } catch (err) {
      handleError(err.message || 'Error during the Buy Now process.');
    }
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-details-page">
      <header className="header">
      <h1 className="company-name">
          <Link to="/home" className="home-link">
            Trendy Treasures
          </Link>
        </h1>
        <div className="header-right">
          <FaShoppingCart className="cart-icon" onClick={() => handleCartClick(navigate)} />
          <div className="profile-dropdown">
            <FaUser className="profile-icon" onClick={() => setShowDropdown(!showDropdown)} />
            <span className="user-name">{loggedInUser}</span>
            {showDropdown && (
              <div className="dropdown-content">
                {loggedInUser ? (
                  <>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={handleDeleteAccount}>Remove Account</button>
                  </>
                ) : (
                  <button onClick={() => navigate('/login')}>Login</button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="product-details-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-big-image"
        />
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="product-price">Price: ${product.price}</p>
          <p className={`product-stock ${product.inStock ? '' : 'out-of-stock'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
          {product.features && product.features.length > 0 && (
            <>
              <h3>Features:</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </>
          )}
          <div className="actions">
            <label htmlFor="quantity" className="quantity-label">
              Quantity:
            </label>
            <select
              id="quantity"
              className="quantity-dropdown"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            >
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
            <button onClick={handleAddToCart} className="add-to-cart-button">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="buy-now-button">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <ToastContainer/>

    </div>
    
  );
}

export default ProductDetails;
