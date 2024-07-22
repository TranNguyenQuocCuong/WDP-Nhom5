import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/admins/user/${userId}`)
            .then(response => setUser(response.data))
            .catch(error => console.error("There was an error fetching the user details!", error));
    }, [userId]);

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Box component={Paper} p={2} m={2}>
            <Typography variant="h4">{user.name}</Typography>
            <Typography variant="h6">Username: {user.username}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Address: {user.address}</Typography>
            <Typography>Gender: {user.gender}</Typography>
            <Typography>Age: {user.age}</Typography>
            <Typography>Phone: {user.phone}</Typography>
            {/* Add more fields as needed */}
        </Box>
    );
};

export default UserDetail;
