import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const GetUserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEditing, setIsEditing] = useState(true);

    const handleEditProfileClick = () => {
        setIsEditing(!isEditing);
    };

    // Get profile
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
                setEmail(response.data.email);
                setGender(response.data.gender);
                setAge(response.data.age);
                setPhone(response.data.phone);
                setAddress(response.data.address);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    // Edit profile
    const handleEditProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                'http://localhost:5000/api/users/edit-profile',
                { name, email, gender, age, phone, address },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    // Change password
    const handleChangePassWord = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:5000/api/users/change-password', {
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            alert('Change password successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            console.error('Error changing password:', error.response.data.msg);
            alert('Failed to change password');
        }
    };

    return (
        <div className="main-content">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-lg-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body text-center">
                                <div className="profile-info">
                                    <img
                                        src="https://static.vecteezy.com/system/resources/thumbnails/025/337/669/small_2x/default-male-avatar-profile-icon-social-media-chatting-online-user-free-vector.jpg"
                                        className="rounded-circle mb-3"
                                        alt="Profile"
                                        style={{ width: '150px' }}
                                    />
                                    <h5 className="card-title">{profile && profile.name}</h5>
                                </div>
                                <div className="online-indicator">
                                    <p className="card-text">
                                        <small className="text-muted">
                                            <span className="pulsating-dot"></span>Online
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow mt-4">
                            <div className="card-body">
                                <h5 className="card-title">Change Password</h5>
                                <form onSubmit={handleChangePassWord}>
                                    <div className="form-group">
                                        <label htmlFor="input-curr-pass">Current Password</label>
                                        <input
                                            type="password"
                                            id="input-curr-pass"
                                            className="form-control"
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="input-new-pass">New Password</label>
                                        <input
                                            type="password"
                                            id="input-new-pass"
                                            className="form-control"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-info btn-block">Save Change</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card shadow">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="mb-0">My Account</h3>
                                    <button
                                        className={`btn ${isEditing ? 'btn-primary' : 'btn-danger'}`}
                                        onClick={handleEditProfileClick}
                                    >
                                        {isEditing ? 'Edit Profile' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleEditProfile}>
                                    <div className="form-group">
                                        <label htmlFor="input-username">Username</label>
                                        <input
                                            type="text"
                                            id="input-username"
                                            className="form-control"
                                            value={profile && profile.username}
                                            readOnly={true}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="input-email">Email address</label>
                                        <input
                                            type="email"
                                            id="input-email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            readOnly={isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="input-fullname">Full name</label>
                                        <input
                                            type="text"
                                            id="input-fullname"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            readOnly={isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="input-gender">Gender</label>
                                        <input
                                            type="text"
                                            id="input-gender"
                                            className="form-control"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            readOnly={isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="input-age">Age</label>
                                        <input
                                            type="text"
                                            id="input-age"
                                            className="form-control"
                                            value={profile && profile.age}
                                            readOnly={isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="input-phone">Phone number</label>
                                        <input
                                            type="text"
                                            id="input-phone"
                                            className="form-control"
                                            value={profile && profile.phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            readOnly={isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="input-address">Address</label>
                                        <input
                                            type="text"
                                            id="input-address"
                                            className="form-control"
                                            value={profile && profile.address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            readOnly={isEditing}
                                        />
                                    </div>
                                    {!isEditing && (
                                        <button type="submit" className="btn btn-info">Save</button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetUserProfile;
