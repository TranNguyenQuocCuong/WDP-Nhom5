import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/login';
import Signup from './components/signup';
import ViewCoach from './components/viewCoach';
import ViewCourse from './components/viewCourse';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/resetPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Kiểm tra xem có JWT token trong localStorage hay không
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        // Xóa token khỏi localStorage và đặt isLoggedIn về false
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const handleLogin = (token) => {
        // Lưu token vào localStorage và đặt isLoggedIn về true
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">Logo</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/view-coach">View Coach</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/view-workout-course">View Workout Course</Link>
                                </li>
                            </ul>
                            <ul className="navbar-nav ms-auto">
                                {isLoggedIn ? (
                                    <li className="nav-item">
                                        <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                    </li>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/signup">Signup</Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>

                <Routes>
                    <Route path="/view-coach" element={<ViewCoach />} />
                    <Route path="/view-workout-course" element={<ViewCourse />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
