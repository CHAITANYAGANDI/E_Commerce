import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleError, handleSuccess,handleCartClick } from '../utils';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import '../Cart.css';
import '../Home.css';


function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('');

  const [subTotal, setSubTotal] = useState(0);
  const [updatedItems, setUpdatedItems] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartDetails();
  }, [navigate]);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('UserToken');
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

  const fetchCartDetails = async () => {
    const userId = localStorage.getItem('currentUserEmail');
    if (!userId) {
      handleError('Please log in to view the cart.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:7000/api/user/cart/get/${userId}`, {
        headers: {
          'Authorization': localStorage.getItem('UserToken'),
        }

      });
      if (response.ok) {
        const result = await response.json();
        setCartItems(result.cartItems || []);
        calculateSubtotal(result.cartItems);
      } else {
        const errorData = await response.json();
        
        if (errorData.message.toLowerCase().includes('token has expired')){
          handleLogout();
        }

        handleError(errorData.message || 'Failed to fetch cart items.');
      }
    } catch (err) {
      handleError(err.message || 'Error fetching cart details.');
    }
  };

  const calculateSubtotal = (items) => {
    const subtotal = items.reduce(
      (total, item) => total + item.productPrice * item.productQuantity,
      0
    );
    setSubTotal(subtotal);
  };

  const handleQuantityChange = (productName, newQuantity) => {
    setUpdatedItems((prevState) => ({
      ...prevState,
      [productName]: newQuantity,
    }));
  };

  const handleUpdateQuantity = async (productName) => {
    const newQuantity = updatedItems[productName];
    const userId = localStorage.getItem('currentUserEmail');
    if (!newQuantity) return;

    try {
      const response = await fetch('http://localhost:7000/api/user/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('UserToken'),
        },
        body: JSON.stringify({ userId,productName, productQuantity: newQuantity }),
      });

      if (response.ok) {
        handleSuccess('Quantity updated successfully!');
        fetchCartDetails(); 
        setUpdatedItems((prevState) => {
          const { [productName]: _, ...rest } = prevState; 
          return rest;
        });
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to update quantity.');
      }
    } catch (err) {
      handleError(err.message || 'Error updating quantity.');
    }
  };

  const handleRemoveItem = async (productName) => {
    try {
      const userId = localStorage.getItem('currentUserEmail');

      const response = await fetch('http://localhost:7000/api/user/cart/remove', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('UserToken'),
         },
        body: JSON.stringify({ userId,productName }),
      });

      if (response.ok) {
        handleSuccess('Item removed successfully!');
        fetchCartDetails();
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to remove item.');
      }
    } catch (err) {
      handleError(err.message || 'Error removing item.');
    }
  };

  const handleContinueShopping = () => {
    navigate('/home');
  };

  const handleCheckout = async () => {
    try {
      const userId = localStorage.getItem('currentUserEmail');

      const addressResponse = await fetch(`http://localhost:7000/api/user/address/get/${userId}`,
        {
          headers: {
            'Authorization': localStorage.getItem('UserToken'),
          }
  
        }
      );
      if (addressResponse.ok) {

        const address = await addressResponse.json();

        if (address.message === 'No addresses found for the user.') {
          navigate('/address/new');
          return;
        }
        
        else{
          const userAddressFromResponse = address.addresses;
          const orderResponse = await fetch('http://localhost:7000/api/user/order/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('UserToken'), },
            body: JSON.stringify({ userId, userAddress: userAddressFromResponse, items: cartItems, total: subTotal }),
          });

          if (orderResponse.ok) {
            handleSuccess('Order placed successfully!');
            navigate('/checkout');
          } else {
            const errorData = await orderResponse.json();
            handleError(errorData.message || 'Failed to place order.');
          }
        }

        
      } else {
        handleError('Failed to fetch address.');
      }
    } catch (err) {
      handleError(err.message || 'Error during checkout.');
    }
  };

  return (
    <div className="cart-page">
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
      
      <h1 className="cart-title">Your Cart</h1>
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item-card">
                <img src={item.productImageUrl} alt={item.productName} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.productName}</h3>
                  <p className="cart-item-price">Price: ${item.productPrice.toFixed(2)}</p>
        
                  <div className="cart-item-actions">
                    <select
                      className="quantity-dropdown"
                      value={
                        updatedItems[item.productName] !== undefined
                          ? updatedItems[item.productName]
                          : item.productQuantity
                      }
                      onChange={(e) =>
                        handleQuantityChange(item.productName, parseInt(e.target.value))
                      }
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>

                    {updatedItems[item.productName] !== undefined &&
                      updatedItems[item.productName] !== item.productQuantity && (
                        <button
                          className="update-button"
                          onClick={() => handleUpdateQuantity(item.productName)}
                        >
                          Update
                        </button>
                      )}
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.productName)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <h2 className="cart-subtotal">Subtotal: ${subTotal.toFixed(2)}</h2>
          <div className="cart-actions">
            <button
              className="continue-shopping-button"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
            <button
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="cart-empty">Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;
