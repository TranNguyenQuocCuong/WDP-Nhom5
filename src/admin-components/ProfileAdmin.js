import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProfileAdmin.css'; // Import the CSS file for custom styles

const ProfileAdmin = () => {
    const [admin, setAdmin] = useState({
        username: '',
        password: '',
        email: '',
    });

    useEffect(() => {
        // Fetch admin profile data on component mount
        axios.get('http://localhost:5000/api/admins/adminProfile')
            .then(response => {
                setAdmin(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the admin data!', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin({ ...admin, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('http://localhost:5000/api/admins/adminProfile', admin)
            .then(response => {
                toast.success('Profile updated successfully!');
                setAdmin(response.data);
            })
            .catch(error => {
                toast.error('There was an error updating the profile!');
                console.error('There was an error updating the profile!', error);
            });
    };

    return (
        <div className="profile-admin">
            <h2>Admin Profile</h2>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={admin.username}
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
                        value={admin.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={admin.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>
    );
};

export default ProfileAdmin;
