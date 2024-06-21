import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import FacebookLoginButton from './facebookLogin'; // Import Facebook login component
import GoogleLoginComponent from './googleLogin';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-header">
                            <h3 className="text-center font-weight-light my-4">Sign In</h3>
                        </div>
                        <div className="card-body">
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="username">Username</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="password">Password</label>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary btn-block">Log In</button>
                                </div>
                            </form>
                            <hr />
                            <div className="d-flex justify-content-center"> {/* Add a container for social login buttons */}
                                <FacebookLoginButton /> {/* Add Facebook login button */}
                                <GoogleLoginComponent /> {/* Add Google login button */}
                            </div>
                        </div>
                        <div className="card-footer text-center py-3">
                            <div className="small">
                                <Link to="/forgotpassword" className="link-primary">Forgot password?</Link>
                            </div>
                            <hr />
                            <div className="small">
                                <p className="text-muted mb-0">New to ProGymer? <Link to="/signup" className="link-primary">Create an account</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
