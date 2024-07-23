import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions,
    Typography, IconButton, TablePagination, Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

function CoachAdmin() {
    const [coaches, setCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        address: '',
        age: '',
        experience: '',
        password: ''
    });
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToChange, setStatusToChange] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');

    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:5000/api/admins/coach')
            .then(response => {
                setCoaches(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the coaches!", error);
            });
    }, []);

    const handleRowClick = (coach) => {
        setSelectedCoach(coach);
        setOpen(true);
        setIsAdding(false);
        setFormData({
            username: coach.username || '',
            email: coach.email || '',
            name: coach.name || '',
            address: coach.address || '',
            age: coach.age || '',
            experience: coach.experience || '',
            password: coach.password || ''
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCoach(null);
        setIsAdding(false);
        setFormData({
            username: '',
            email: '',
            name: '',
            address: '',
            age: '',
            experience: '',
            password: ''
        });
        setStatusDialogOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAddCoach = () => {
        setIsAdding(true);
        setOpen(true);
        setFormData({
            username: '',
            email: '',
            name: '',
            address: '',
            age: '',
            experience: '',
            password: ''
        });
    };

    const handleSave = () => {
        if (isAdding) {
            axios.post('http://localhost:5000/api/admins/coach', formData)
                .then(response => {
                    setCoaches([...coaches, response.data]);
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error adding the coach!", error);
                });
        } else {
            axios.put(`http://localhost:5000/api/admins/coach/${selectedCoach._id}`, formData)
                .then(response => {
                    setCoaches(prevCoaches => prevCoaches.map(coach => coach._id === response.data._id ? response.data : coach));
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error updating the coach!", error);
                });
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewCoach = (coachId) => {
        history.push(`/admin/coach/${coachId}`);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCoaches = coaches.filter(coach =>
        coach.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coach.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ marginLeft: '250px', padding: '16px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddCoach}
                >
                    Add Coach
                </Button>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ width: '300px' }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCoaches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((coach, index) => (
                            <TableRow key={coach._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{coach.username}</TableCell>
                                <TableCell>{coach.email}</TableCell>
                                <TableCell>{coach.name}</TableCell>
                                <TableCell>{coach.address}</TableCell>
                                <TableCell>{coach.age}</TableCell>
                                <TableCell>{coach.experience}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleRowClick(coach)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="info" onClick={() => handleViewCoach(coach._id)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredCoaches.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isAdding ? 'Add Coach' : 'Edit Coach'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!isAdding}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="address"
                        label="Address"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="age"
                        label="Age"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.age}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="experience"
                        label="Experience"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.experience}
                        onChange={handleInputChange}
                    />
                    {isAdding && (
                        <TextField
                            margin="dense"
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        {isAdding ? 'Add' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CoachAdmin;
