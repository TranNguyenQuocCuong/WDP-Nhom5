import React, { useState } from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const FacebookLoginButton = () => {
    const responseFacebook = async (response) => {
        try {
            console.log(response)
            const res = await axios.get(`http://localhost:5000/api/users/facebook/token?access_token=${response.accessToken}`);
            alert(res.data.status);
            localStorage.setItem('token', res.data.token);
            window.location.href = '/';
        } catch (error) {
            alert('Error logging in with Facebook: ' + (error.response.data.msg || error.message));
        }
    };

    return (
        <FacebookLogin
            appId="925354229132209"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            render={renderProps => (
                <button onClick={renderProps.onClick} className="btn btn-primary btn-block">
                    Log In with Facebook
                </button>
            )}
        />
    );
};

export default FacebookLoginButton;
