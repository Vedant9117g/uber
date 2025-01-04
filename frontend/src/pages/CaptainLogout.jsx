import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const token = localStorage.getItem('captain-token');
                if (token) {
                    await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
                localStorage.removeItem('captain-token');
                navigate('/captain-login');
            } catch (error) {
                console.error('Logout error:', error);
                localStorage.removeItem('captain-token');
                navigate('/captain-login');
            }
        };

        logout();
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default CaptainLogout;
