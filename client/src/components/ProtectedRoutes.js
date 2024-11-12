import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../ProtectedRoutes.css'
import { handleError, handleSuccess } from '../utils';


const CredentialsTable = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchCredentials = async () => {
      try {
        const response = await axios.get('http://localhost:5001/admin/client/creds'); 
        if (response.data.success) {
          setCredentials(response.data.data); 
        } else {
          console.error('Failed to fetch credentials:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('AuthToken');
    handleSuccess('Logged out successfully');
    setTimeout(() => {
      navigate('/admin/login');
    }, 1000);
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="credentials-table-container">
      <div className="top-bar">
        <button onClick={handleBack} className="back-button">&#8592; Back</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <h2>API Credentials</h2>
      <table>
        <thead>
          <tr>
            <th>API Name</th>
            <th>API URL</th>
            <th>Access Token</th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((credential) => (
            <tr key={credential._id}>
              <td>{credential.api_name}</td>
              <td>{credential.api_url}</td>
              <td>{credential.access_token}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CredentialsTable;
