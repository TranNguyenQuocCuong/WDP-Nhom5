import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-lightblue">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">MyApp</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup">Signup</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
