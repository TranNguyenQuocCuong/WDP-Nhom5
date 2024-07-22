import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useCart } from '../context/CartContext';  // Import useCart hook
import './Navbar.css';


export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isWorkoutDropdownOpen, setWorkoutDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [subscribedCourses, setSubscribedCourses] = useState([]);

  const { getCartItemCount } = useCart();  // Get cart item count

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleWorkoutDropdown = () => {
    setWorkoutDropdownOpen(!isWorkoutDropdownOpen);
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!isUserDropdownOpen);
    setWorkoutDropdownOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/userProfile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProfile(response.data);
        setName(response.data.name);
        setSubscribedCourses(response.data.subscribedCourses || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
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
              <li className="nav-item dropdown" onMouseEnter={toggleWorkoutDropdown} onMouseLeave={() => setWorkoutDropdownOpen(false)}>
                <span className="nav-link dropdown-toggle" style={{ color: '#fff' }}>
                  Workout Plan
                </span>
                <div className={`dropdown-menu ${isWorkoutDropdownOpen ? 'show' : ''}`} style={{ backgroundColor: '#000' }}>
                  <NavLink className="dropdown-item" activeClassName="active" to="/course">
                    Course
                  </NavLink>
                  <NavLink className="dropdown-item" activeClassName="active" to="/coach">
                    Coach
                  </NavLink>
                </div>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/shop">
                  Shop
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/contact">
                  Contact
                </NavLink>
              </li>

              {isLoggedIn ? (
                <li className="nav-item dropdown" onMouseEnter={toggleUserDropdown} onMouseLeave={() => setUserDropdownOpen(false)} style={{ position: 'relative' }}>
                  <span className="nav-link dropdown-toggle" style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faUser} /><span style={{ marginLeft: '8px' }}>{name}</span>
                  </span>
                  <div className={`dropdown-menu ${isUserDropdownOpen ? 'show' : ''}`} style={{ backgroundColor: '#000', padding: '10px', borderRadius: '8px' }}>
                    <NavLink className="nav-link" activeClassName="active" to="/userProfile">
                      User Profile
                    </NavLink>
                    {subscribedCourses.length > 0 && (
                      <>
                        <NavLink className="nav-link" activeClassName="active" to="/userSchedule">
                          User Schedule
                        </NavLink>
                        <NavLink className="nav-link" activeClassName="active" to="/editUserSchedule">
                          Edit Schedule
                        </NavLink>
                      </>
                    )}
                    <NavLink className="nav-link" activeClassName="active" to="/user/transactions">
                      User Transaction
                    </NavLink>
                    <button className="btn btn-link nav-link" onClick={handleLogout} style={{ color: '#fff', backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                      <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                      Logout
                    </button>
                  </div>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" activeClassName="active" to="/login">
                    <FontAwesomeIcon icon={faUser} /> Login
                  </NavLink>
                </li>
              )}

              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" to="/cart">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span className="badge bg-primary">{getCartItemCount()}</span> {/* Display cart item count */}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
