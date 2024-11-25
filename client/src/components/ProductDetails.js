import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import '../ProductDetails.css';

function ProductDetails() {
  const { productId } = useParams();
  const [walmartProduct, setWalmartProduct] = useState(null);
  const [amazonProduct, setAmazonProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const walmartUrl = `http://localhost:7000/api/walmart/products/${productId}`;
        const amazonUrl = `http://localhost:7000/api/amazon/products/${productId}`;

        const headers = {
          headers: {
            'WalmartAuthorization': localStorage.getItem('Walmart_Products_AccessToken'),
            'AmazonAuthorization': localStorage.getItem('Amazon_Products_AccessToken'),
          },
        };

        // Fetch data from both APIs concurrently
        const [walmartResponse, amazonResponse] = await Promise.allSettled([
          fetch(walmartUrl, { headers: { ProductsAuthorization: headers.headers.WalmartAuthorization } }),
          fetch(amazonUrl, { headers: { ProductsAuthorization: headers.headers.AmazonAuthorization } }),
        ]);

        if (walmartResponse.status === 'fulfilled' && walmartResponse.value.ok) {
          const walmartResult = await walmartResponse.value.json();
          setWalmartProduct(walmartResult.product || walmartResult);
        }

        if (amazonResponse.status === 'fulfilled' && amazonResponse.value.ok) {
          const amazonResult = await amazonResponse.value.json();
          setAmazonProduct(amazonResult.product || amazonResult);
        }
      } catch (err) {
        handleError(err.message || 'Error fetching product details.');
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    handleSuccess('Product added to cart!');
  };

  const handleBuyNow = () => {
    navigate('/checkout');
  };

  if (!walmartProduct && !amazonProduct) {
    return <p>Loading product details...</p>;
  }

  const product = walmartProduct || amazonProduct;

  return (
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
          <button onClick={handleAddToCart} className="add-to-cart-button">
            Add to Cart
          </button>
          <button onClick={handleBuyNow} className="buy-now-button">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
