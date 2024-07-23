import React, { useEffect, useState } from 'react'
import './Login.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import { gapi } from "gapi-script";
import FacebookLoginButton from './facebookLogin';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const clientId = '345177848260-gt4s9487god6jt45848agv4ugru143v3.apps.googleusercontent.com';

    useEffect(() => {
        gapi.load("auth2", () => {
            gapi.auth2.init({ clientId: clientId })
        })
    }, []);

    const onSuccess = (response) => {
        console.log('[Login Success] currentUser: ', response.profileObj);
    };

    const onFailure = (response) => {
        console.log('[Login Failed] response: ', response);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
            alert(response.data.msg);
            localStorage.setItem('token', response.data.token);
            window.location.href = '/';
        } catch (error) {
            const errorMsg = error.response && error.response.data && error.response.data.msg
                ? error.response.data.msg
                : 'Error logging in';
            setErrorMessage(errorMsg);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="login_wrapper">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-xs-12 col-sm-6">
                                    <FacebookLoginButton
                                        className="btn btn-primary d-flex justify-content-between facebook"
                                        iconClassName="fa fa-facebook"
                                    />
                            </div>

                            <div className="col-lg-6 col-md-6 col-xs-12 col-sm-6">
                                <GoogleLogin clientId={clientId}
                                    buttonText={"Login with Google"}
                                    onSuccess={onSuccess}
                                    onFailure={onFailure} npm i
                                    cookiePolicy={'single_host_origin'}
                                    className={'btn btn-primary google-plus'}
                                    isSignedIn={true}
                                />
                            </div>
                        </div>
                        <h2>or</h2>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="formsix-pos">
                                <div className="form-group i-email">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="formsix-e">
                                <div className="form-group i-password">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="login_remember_box">
                                <label className="control control--checkbox">
                                    Remember me
                                    <input type="checkbox" />
                                    <span className="control__indicator"></span>
                                </label>
                                <Link to="/forgotpassword" className="link-primary forget_password">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="login_btn_wrapper">
                                <button type="submit" className="btn btn-primary btn-block login_btn">
                                    Log In
                                </button>
                            </div>
                            <div className="login_message">
                                <p>
                                    Don’t have an account?{' '}
                                    <Link to="/signup" className="link-primary">
                                        Create an account
                                    </Link>{' '}
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};