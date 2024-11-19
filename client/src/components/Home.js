import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import '../Home.css';
function Home() {
  const [loggedInuser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('otpVerificationStatus');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out successfully');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const fetchProducts = async () => {
    try {
      const url = "http://localhost:7000/api/products/get";  // Ensure correct API URL

      const headers = {
        headers: {
          'ProductsAuthorization': localStorage.getItem('ProductsAccessToken'),
          'InventoryAuthorization': localStorage.getItem('InventoryAccessToken'),
        },
      };

      const response = await fetch(url,headers);
      const result = await response.json();
      
      setProducts(Array.isArray(result) ? result : result.products || []);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome {loggedInuser}</h1>
      

      <div className="product-container">
        {products.map((item, index) => (
          <div key={index} className="product-card">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="product-image"
            />
            <div className="product-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price}</p>
              <p>{item.inStock ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
