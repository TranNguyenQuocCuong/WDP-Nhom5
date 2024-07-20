import React, { useState } from 'react'
import './CoachLogin.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/coaches/login', { username, password });
            alert(response.data.msg);
            localStorage.setItem('token', response.data.token);
            window.location.hash = '/CoachDashBoard';
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
                            </div>
                            
                            <div className="login_message">
                                <p>
                                    Are you a user?{' '}
                                    <Link to="/login" className="link-primary">
                                        Login as user
                                    </Link>{' '}
                                </p>
                            </div>
                            <div className="login_btn_wrapper">
                                <button type="submit" className="btn btn-primary btn-block login_btn">
                                    Log In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
