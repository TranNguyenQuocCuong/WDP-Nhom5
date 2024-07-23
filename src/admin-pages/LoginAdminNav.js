import React, { useState } from 'react';
import LoginAdmin from '../admin-components/LoginAdmin';
import NavbarAdmin from '../admin-components/NavbarAdmin';

export default function LoginAdminNav() {
    const [token, setToken] = useState(null);

    const handleLoginSuccess = (token) => {
        setToken(token);
        console.log('Logged in successfully with token:', token);
        // You can add additional logic here, such as redirecting or updating the UI
    };

    return (
        <div>
            <LoginAdmin onLoginSuccess={handleLoginSuccess} />
        </div>
    );
}
