import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleLoginComponent = ({ className, iconClassName }) => {
    const responseGoogle = (response) => {
        console.log(response);
        const { tokenId } = response;
        fetch('http://localhost:5000/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokenId }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.href = '/';
                } else {
                    alert('Login failed');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            render={renderProps => (
                <a href="#" onClick={renderProps.onClick} className={className}>
                    Login with Google <i className={iconClassName}></i>
                </a>
            )}
        />
    );
};

export default GoogleLoginComponent;