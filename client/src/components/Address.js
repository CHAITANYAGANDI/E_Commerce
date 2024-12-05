import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import {ToastContainer} from 'react-toastify'

import '../Address.css';

function AddressForm() {
  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    countryRegion: '',
    city: '',
    province: '',
    postalCode: '',
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem('currentUserEmail');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      handleError('User not logged in.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:7000/api/user/address/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('UserToken'),
         },
        body: JSON.stringify({ ...address, userId }),
      });

      if (response.ok) {
        handleSuccess('Address added successfully!');
        setTimeout(() => {
            navigate('/home');
          }, 2000); 
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to add address.');
      }
    } catch (err) {
      handleError(err.message || 'Error adding address.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <h2>Add a new address</h2>

      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={address.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={address.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={address.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="countryRegion">Country/Region</label>
        <input
          type="text"
          id="countryRegion"
          name="countryRegion"
          value={address.countryRegion}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          name="city"
          value={address.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="province">Province</label>
        <input
          type="text"
          id="province"
          name="province"
          value={address.province}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="postalCode">Postal Code</label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={address.postalCode}
          onChange={handleChange}
          required
        />
      </div>
      

      <button type="submit" className="submit-button">
        Save Address
      </button>
      <ToastContainer/>
    </form>
  );
}

export default AddressForm;
