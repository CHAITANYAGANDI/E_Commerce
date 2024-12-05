import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { FaTrashAlt } from 'react-icons/fa';
import '../UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:7000/api/user/admin/users/get', {
        headers: {
          Authorization: localStorage.getItem('AdminToken'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to fetch users');
      }
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (email) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      const response = await fetch(`http://localhost:7000/api/user/admin/users/delete/${email}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('AdminToken'),
        },
      });

      if (response.ok) {
        handleSuccess('Admin deleted successfully');
        setUsers(users.filter(user => user.email !== email));
      } else {
        const errorData = await response.json();
        handleError(errorData.message || 'Failed to delete admin');
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-management-container">
      <header className="header">
        <h1>User Management</h1>
        <button className="back-button" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </button>
      </header>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="user-list">
          <table className="user-table">
            <thead>
              <tr>
                <th>S. No</th>
                <th>User Name</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.email}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role === 'Admin' && (
                      <button
                        className="delete-button"
                        onClick={() => deleteAdmin(user.email)}
                        title="Delete Admin"
                      >
                        <FaTrashAlt className="trash-icon" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
