import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra xem có JWT token trong localStorage hay không
    const token = localStorage.getItem('token');
    console.log('>>> token: ', token);
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    // Lưu token vào localStorage và đặt isLoggedIn về true
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Xóa token khỏi localStorage và đặt isLoggedIn về false
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/userProfile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(response.data);
        setName(response.data.name);

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div id="navBar" className="position-absolute">
      <nav className="navbar bg-dark-lg navbar-expand-lg">
        <div className="container-fluid">
          <Link id="gym" to="/" className="navbar-brand mx-lg-5 mx-4 mt-1">
            <h1 className="m-0 display-2 font-weight-bold text-uppercase text-white">
              Fit<span style={{ color: '#0088c7' }}>Zone</span>
              <img src='/src/assets/image/Fitzonelogo.png' alt="" />
            </h1>
          </Link>

          <div className="menu me-3">
            <button
              type="button"
              onClick={toggleMenu}
              className="navbar-toggler"
              data-toggle="collapse"
              data-target="#navbarCollapse"
            >
              <span>
                <i className="fa-regular fa-bars"></i>
              </span>
            </button>
          </div>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav ms-lg-5 me-auto mb-2 mb-lg-0 text-uppercase">
              <li className="nav-item">
                <NavLink className="nav-link home" activeClassName="active" exact to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/about">
                  About Us
                </NavLink>
              </li>
              <li className="nav-item dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                <span className="nav-link dropdown-toggle">
                  Workout Plan
                </span>
                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                  <NavLink className="dropdown-item" activeClassName="active" to="/course">
                    Course
                  </NavLink>
                  <NavLink className="dropdown-item" activeClassName="active" to="/coach">
                    Coach
                  </NavLink>
                </div>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/features">
                  Features
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/contact">
                  Contact
                </NavLink>
              </li>
              {isLoggedIn ? (
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to="/userProfile">
                    <FontAwesomeIcon icon={faUser} /><span style={{ marginLeft: '8px' }}>{name}</span>

                  </NavLink>

                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>

              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to="/login">
                    <FontAwesomeIcon icon={faUser} /> Login
                  </NavLink>
                </li>
              )}
              {/* <li>
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
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}