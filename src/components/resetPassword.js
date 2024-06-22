import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css'; // Import the custom CSS file

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const history = useHistory();
    const { id, token } = useParams();

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`http://localhost:5000/api/users/resetpassword/${id}/${token}`, { password })
            .then(res => {
                setLoading(false);
                if (res.data.Status === "Success") {
                    setMessage('Password updated successfully. Redirecting to login...');
                    setTimeout(() => history.push('/login'), 3000);
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
        <div className="reset-password-container d-flex justify-content-center align-items-center vh-100">
            <div className="form-container bg-white p-4 rounded shadow-lg">
                <h4 className="mb-3">Reset Password</h4>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            <strong>New Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <Link to="/login" className="text-decoration-none">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
