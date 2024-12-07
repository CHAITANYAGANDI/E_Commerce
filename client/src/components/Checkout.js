import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleError, handleSuccess, handleCartClick } from '../utils';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import '../Checkout.css';
import '../Home.css';

function Checkout() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, []);

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

  const fetchOrderDetails = async () => {
    const userId = localStorage.getItem('currentUserEmail');
    if (!userId) {
      handleError('Please log in to view your order.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:7000/api/user/order/get/${userId}`, {
        headers: {
          'Authorization': localStorage.getItem('UserToken'),
        },
      });
      if (response.ok) {
        const result = await response.json();
        setOrderDetails(result.orders[0]);
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to fetch order details.');
      }
    } catch (err) {
      handleError(err.message || 'Error fetching order details.');
    }
  };

  const calculateExpectedDeliveryDate = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7);
    return date.toDateString();
  };

  if (!orderDetails) {
    return <p>Loading order details...</p>;
  }

  return (
    <div className="checkout-page">
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
      <h1 className="checkout-title">Checkout</h1>

      <section className="order-summary">
        <h2 className="section-title">Order Summary</h2>
        <p>
          <strong>Order Number:</strong> {orderDetails.orderNumber}
        </p>
      </section>

      <section className="shipping-address">
        <h2 className="section-title">Shipping Address</h2>
        <div className="address-details">
          <p><strong>Name:</strong> {orderDetails.address_id[0].fullName}</p>
          <p><strong>Phone:</strong> {orderDetails.address_id[0].phoneNumber}</p>
          <p><strong>Address:</strong> {orderDetails.address_id[0].address}</p>
          <p><strong>City:</strong> {orderDetails.address_id[0].city}, {orderDetails.address_id[0].province}</p>
          <p><strong>Postal Code:</strong> {orderDetails.address_id[0].postalCode}</p>
        </div>
      </section>

      <section className="review-order-items">
        <h2 className="section-title">Review Order Items</h2>
        <div className="order-items">
          {orderDetails.items_id.map((item, index) => (
            <div key={index} className="order-item-card">
              <img
                src={item.productImageUrl}
                alt={item.productName}
                className="order-item-image"
              />
              <div className="order-item-details">
                <h3 className="order-item-name">{item.productName}</h3>
                <p>{item.productDescription}</p>
                <p><strong>Price:</strong> ${item.productPrice.toFixed(2)}</p>
                <p><strong>Sold By:</strong> {item.productSoldBy}</p>
                <p><strong>Quantity:</strong> {item.productQuantity}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="order-total">
        <h2 className="section-title">Order Total</h2>
        <div className="order-total-item">
          <span>Total:</span>
          <strong>${orderDetails.total.toFixed(2)}</strong>
        </div>
        <div className="order-total-item">
          <span>Order Date:</span>
          <strong>{new Date(orderDetails.createdAt).toDateString()}</strong>
        </div>
        <div className="order-total-item">
          <span>Expected Delivery Date:</span>
          <strong>{calculateExpectedDeliveryDate(orderDetails.createdAt)}</strong>
        </div>
      </section>

      <div className="checkout-actions">
        <button className="proceed-to-pay" onClick={() => navigate('/payment')}>
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}

export default Checkout;

