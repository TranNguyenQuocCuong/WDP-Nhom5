import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const history = useHistory();

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post('http://localhost:5000/api/users/forgotpassword', { email })
            .then(res => {
                setLoading(false);
                if (res.data.Status === "Success") {
                    setMessage('Check your email for further instructions.');
                    setTimeout(() => history.push('/resetpassword'), 3000);
                } else {
                    setMessage('An error occurred. Please try again.');
                }
            }).catch(err => {
                setLoading(false);
                setMessage('An error occurred. Please try again.');
                console.log(err);
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-centervh-100">
            <div className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h4 className="mb-3">Forgot Password</h4>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0" disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <Link to="/login" className="text-decoration-none">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
