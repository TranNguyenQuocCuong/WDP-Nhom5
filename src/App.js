import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import ViewCoach from './components/viewCoach';
import ViewCourse from './components/viewCourse';
import './App.css';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/resetPassword';

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <div className="navbar-left">
                        <Link to="/">Logo</Link>
                    </div>
                    <div className="navbar-middle">
                        <ul>
                            <li>
                                <Link to="/view-coach">View Coach</Link>
                            </li>
                            <li>
                                <Link to="/view-workout-course">View Workout Course</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-right">
                        <ul>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/signup">Signup</Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <Routes>
                    <Route path="/view-coach" element={<ViewCoach />} />
                    <Route path="/view-workout-course" element={<ViewCourse />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/resetpassword" element={<ResetPassword/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
