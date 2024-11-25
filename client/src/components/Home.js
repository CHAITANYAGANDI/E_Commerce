import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import '../Home.css';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 15;

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

  const fetchProducts = async () => {
    try {
      const walmartUrl = 'http://localhost:7000/api/walmart/products/get';
      const amazonUrl = 'http://localhost:7000/api/amazon/products/get';

      const headers = {
        'ProductsAuthorization': localStorage.getItem('Walmart_Products_AccessToken'),
      };
      const walmartHeaders = { headers };
      const amazonHeaders = {
        headers: {
          'ProductsAuthorization': localStorage.getItem('Amazon_Products_AccessToken'),
        },
      };

      const [walmartResponse, amazonResponse] = await Promise.all([
        fetch(walmartUrl, walmartHeaders),
        fetch(amazonUrl, amazonHeaders),
      ]);

      const walmartProducts = await walmartResponse.json();
      const amazonProducts = await amazonResponse.json();

      const taggedWalmartProducts = (Array.isArray(walmartProducts) ? walmartProducts : walmartProducts.products || []).map(
        (product) => ({ ...product, source: 'walmart' })
      );

      const taggedAmazonProducts = (Array.isArray(amazonProducts) ? amazonProducts : amazonProducts.products || []).map(
        (product) => ({ ...product, source: 'amazon' })
      );

      const combinedProducts = [...taggedWalmartProducts, ...taggedAmazonProducts];

      setProducts(combinedProducts);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const pageCount = Math.ceil(products.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="company-name">Trendy Treasures</h1>
        <div className="header-right">
          <input type="text" placeholder="Search..." className="search-bar" />
          <FaShoppingCart className="cart-icon" />
          <div className="profile-dropdown">
            <FaUser className="profile-icon" onClick={() => setShowDropdown(!showDropdown)} />
            <span className="user-name">{loggedInUser}</span>
            {showDropdown && (
              <div className="dropdown-content">
                {loggedInUser ? (
                  <button onClick={handleLogout}>Logout</button>
                ) : (
                  <button onClick={() => navigate('/login')}>Login</button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="product-container">
        {products.slice(offset, offset + itemsPerPage).map((item, index) => (
          <div
            key={index}
            className="product-card"
            onClick={() => handleProductClick(item._id)}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="product-image"
            />
            <div className="product-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price">${item.price}</p>
              <p className={item.inStock ? 'in-stock' : 'out-of-stock'}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
              <img
                src={item.source === 'amazon' ? amazonLogoUrl : walmartLogoUrl}
                alt={`${item.source} logo`}
                className={`source-logo ${item.source === 'walmart' ? 'walmart-logo' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>

      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
}

export default Home;
