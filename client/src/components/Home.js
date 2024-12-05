import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { handleError, handleSuccess, handleCartClick } from '../utils';
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
    localStorage.removeItem('currentUserEmail');
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

      let walmartProducts = [];
      let amazonProducts = [];

      try {
        const walmartResponse = await fetch(walmartUrl, walmartHeaders);
        if (walmartResponse.ok) {
          walmartProducts = await walmartResponse.json();
          walmartProducts = Array.isArray(walmartProducts)
            ? walmartProducts
            : walmartProducts.products || [];
        }
      } catch (err) {
        console.warn('Walmart products could not be fetched:', err);
      }

      try {
        const amazonResponse = await fetch(amazonUrl, amazonHeaders);
        if (amazonResponse.ok) {
          amazonProducts = await amazonResponse.json();
          amazonProducts = Array.isArray(amazonProducts)
            ? amazonProducts
            : amazonProducts.products || [];
        }
      } catch (err) {
        console.warn('Amazon products could not be fetched:', err);
      }

      const taggedWalmartProducts = walmartProducts.map((product) => ({
        ...product,
        source: 'walmart',
      }));

      const taggedAmazonProducts = amazonProducts.map((product) => ({
        ...product,
        source: 'amazon',
      }));

      const combinedProducts = [...taggedWalmartProducts, ...taggedAmazonProducts];

      if (taggedWalmartProducts.length > 0 && taggedAmazonProducts.length > 0) {
        setProducts(combinedProducts);
      } else if (taggedWalmartProducts.length > 0) {
        setProducts(taggedWalmartProducts);
      } else if (taggedAmazonProducts.length > 0) {
        setProducts(taggedAmazonProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (productId, source) => {
    navigate(`/product/${source}/${productId}`);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const pageCount = Math.ceil(products.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;

  return (
    <div className="home-container">
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

      <div className="product-container">
        {products.slice(offset, offset + itemsPerPage).map((item, index) => (
          <div
            key={index}
            className="product-card"
            onClick={() => handleProductClick(item._id, item.source)}
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

