import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GiveAdvice.css';

export default function GiveAdvice() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [adviceMessage, setAdviceMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/coaches/my-student', 
            {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const adviceData = {
            userId: selectedUser,
            message: adviceMessage,
        };
        const token = localStorage.getItem('token');
        if (token) {
            axios.post('http://localhost:5000/api/advice/send', adviceData, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    alert('Advice given successfully');
                    setSelectedUser('');
                    setAdviceMessage('');
                })
                .catch(error => console.error('Error giving advice:', error));
        } else {
            console.error('No token found');
        }
    };

    return (
        <div className="give-advice">
            <h2>Give Advice to User</h2>
            <form onSubmit={handleSubmit}>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user._id} value={user._id}>{user.username}</option>
                    ))}
                </select>
                <textarea
                    placeholder="Advice Message"
                    value={adviceMessage}
                    onChange={(e) => setAdviceMessage(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Give Advice</button>
            </form>
        </div>
    );
}
