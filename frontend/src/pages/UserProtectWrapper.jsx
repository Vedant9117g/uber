import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ 
  children
 }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [user, setUser] = useContext(UserDataContext); // Destructure as array
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // Include credentials
          }
        );

        if (response.status === 200) {
          setUser(response.data);
        } else {
          throw new Error('Unauthorized');
        }
      } catch (err) {
        console.error('Authentication failed:', err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
