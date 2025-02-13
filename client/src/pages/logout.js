import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Current cookies:', document.cookie);
        // // Clear the token cookie
        localStorage.setItem("token", "");
        // document.cookie = 'token=;';
        
        // Redirect to login page or home page
        navigate('/login');
    }, [navigate]);

    return null;
};

export default Logout;