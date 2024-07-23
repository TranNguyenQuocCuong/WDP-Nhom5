import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginAdmin.css';

const LoginAdmin = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/admins/adminLogin', credentials);
            if (response.data.token) {
                toast.success('Login successful!');
                onLoginSuccess(response.data.token);
                history.push('/admin/home');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Invalid username or password');
            toast.error('Login error');
            console.error('Login error', err);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        try {
            await axios.post('http://localhost:5000/api/admins/adminforgot');
            toast.success('Password sent to your email!');
            setError('Password reset email sent!');
        } catch (err) {
            toast.error('Error sending password reset email');
            console.error('Forgot password error', err);
        }
    };

    return (
        <div className="login-admin">
            <h2 className="login-header">
                <span className="fit-text">Fit</span>
                <span className="zone-text">Zone</span> Admin Login
            </h2>

            <form onSubmit={handleSubmit} className="login-form">
                {error && <div className="error">{error}</div>}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p
                    className="forgot-password-text"
                    onClick={handleForgotPassword}
                >
                    Forgot Password?
                </p>
            </form>
        </div>
    );
};

export default LoginAdmin;
