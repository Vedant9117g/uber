import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log("No token found. Redirecting to login.");
      navigate('/login');
      return; // Exit if no token is found
    }

    const logoutUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/logout`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Logout successful.");
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login
        } else {
          console.log("Failed to logout: ", response);
        }
      } catch (error) {
        console.error('Logout failed:', error);
        // Handle cases where the token is invalid or expired
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized. Token may be invalid or expired.");
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    logoutUser();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default UserLogout;
