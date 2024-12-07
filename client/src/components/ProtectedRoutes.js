import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ProtectedRoutes.css'
import { handleError, handleSuccess } from '../utils';


const CredentialsTable = () => {
  const [credentials, setCredentials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchCredentials = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/user/admin/client/creds',
          {
          headers: {
            'Authorization': localStorage.getItem('AdminToken'),
          }
        }); 

        if(response.ok){

          const responseData = await response.json();

          setCredentials(responseData.data);

        }

        else{
          

          const errorData = await response.json();
            if (errorData.message.toLowerCase().includes('token has expired')){
                handleLogout();
              }

          console.error('Failed to fetch credentials:', response.data.message);
        }
        
  
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } 
    };

    fetchCredentials();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('AdminToken');
    handleSuccess('Logged out successfully');
    setTimeout(() => {
      navigate('/admin/login');
    }, 1000);
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="credentials-table-container">
    <div className="top-bar">
      <button onClick={handleBack} className="back-button">&#8592; Back</button>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
    <h2>API Credentials</h2>
    <div className="table-container">
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
  </div>
  );
};

export default CredentialsTable;
