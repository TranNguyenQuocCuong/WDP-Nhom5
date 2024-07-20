import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrackUserProgress.css';

export default function TrackUserProgress() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [progress, setProgress] = useState({});
    const [userDetails, setUserDetails] = useState({ height: '', weight: '' });
    const [editing, setEditing] = useState(false);
    const [editedDetails, setEditedDetails] = useState({ height: '', weight: ''});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/coaches/my-student', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => setUsers(response.data))
                .catch(error => console.error('Error fetching users:', error));
        } else {
            console.error('No token found');
        }
    }, []);

    const handleUserSelect = (userId) => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:5000/api/users/${userId}/progress`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setSelectedUser(userId);
                setProgress(response.data);
                setUserDetails({
                    height: response.data.height,
                    weight: response.data.weight
                });
                setEditedDetails({
                    height: response.data.height,
                    weight: response.data.weight
                });
                console.log(`Selected User ID: ${userId}, Height: ${response.data.height}, Weight: ${response.data.weight}`);
            })
            .catch(error => console.error('Error fetching user progress:', error));
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = () => {
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:5000/api/users/${selectedUser}/progress`, editedDetails, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setProgress(response.data);
                setUserDetails({
                    height: response.data.height,
                    weight: response.data.weight
                });
                setEditing(false);
                console.log(`Saved User ID: ${selectedUser}, Height: ${response.data.height}, Weight: ${response.data.weight}`);
            })
            .catch(error => console.error('Error updating user progress:', error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedDetails({ ...editedDetails, [name]: value });
    };

    return (
        <div className="track-user-progress">
            <h2>Track User's Progress</h2>
            <select onChange={(e) => handleUserSelect(e.target.value)} value={selectedUser || ''}>
                <option value="">Select User</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>{user.username}</option>
                ))}
            </select>
            {selectedUser && (
                <div className="user-details">
                    <h3>User Details</h3>
                    {editing ? (
                        <div>
                            <label>
                                Height: 
                                <input type="text" name="height" value={editedDetails.height} onChange={handleChange} /> cm
                            </label>
                            <label>
                                Weight: 
                                <input type="text" name="weight" value={editedDetails.weight} onChange={handleChange} /> kg
                            </label>
                            <button onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Height:</strong> {userDetails.height} cm</p>
                            <p><strong>Weight:</strong> {userDetails.weight} kg</p>
                            <button onClick={handleEdit}>Edit</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
