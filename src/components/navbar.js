import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchProfile(token);
      checkIfCoach(token);
    }
  }, []);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/userProfile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setName(response.data.name);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const checkIfCoach = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/coaches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsCoach(response.data.length > 0);
    } catch (error) {
      console.error('Error checking if user is a coach:', error);
    }
  };

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsCoach(false);
  };

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

          <button
            type="button"
            onClick={toggleMenu}
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#navbarCollapse"
          >
            <span><i className="fa-regular fa-bars"></i></span>
          </button>

          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav ms-lg-5 me-auto mb-2 mb-lg-0 text-uppercase">

                <>
                  {/* Non-coach navigation items */}
                  <li className="nav-item">
                    <NavLink className="nav-link home" activeClassName="active" exact to="/">Home</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/about">About Us</NavLink>
                  </li>
                  <li className="nav-item dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                    <span className="nav-link dropdown-toggle">Workout Plan</span>
                    <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                      <NavLink className="dropdown-item" activeClassName="active" to="/course">Course</NavLink>
                      <NavLink className="dropdown-item" activeClassName="active" to="/coach">Coach</NavLink>
                    </div>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/features">Features</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/contact">Contact</NavLink>
                  </li>
                </>
              
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/userProfile">
                      <FontAwesomeIcon icon={faUser} /><span style={{ marginLeft: '8px' }}>{name}</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" activeClassName="active" to="/edit-profile">Edit Profile</NavLink>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to="/login">
                    <FontAwesomeIcon icon={faUser} /> Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
