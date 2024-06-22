import React, { useState } from 'react'
import './Signup.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import axios from 'axios';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', { username, password, email });
            alert(response.data.msg);
            window.location.href = '/login';
        } catch (error) {
            alert('Error signing up: ' + error.response.data.msg);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Sign Up</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                                </div>
                                <div className="text-center mt-3">
                                    <a href="#" className="link-primary">Forgot password?</a>
                                </div>
                                <hr />
                                <div className="text-center">
                                    <p className="text-muted">Already have an account? <Link to="./login" className="link-primary">Log in</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};