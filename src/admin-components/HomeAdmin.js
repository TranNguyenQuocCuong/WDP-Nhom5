import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions,
    Typography, IconButton, TablePagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Block as BlockIcon, CheckCircle as CheckCircleIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

function HomeAdmin() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        address: '',
        gender: '',
        age: '',
        phone: '',
        password: ''
    });

    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToChange, setStatusToChange] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:5000/api/admins/user')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
            });
    }, []);

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setOpen(true);
        setIsAdding(false);
        setFormData({
            username: user.username || '',
            email: user.email || '',
            name: user.name || '',
            address: user.address || '',
            gender: user.gender || '',
            age: user.age || '',
            phone: user.phone || '',
            password: user.password || ''
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
        setIsAdding(false);
        setFormData({
            username: '',
            email: '',
            name: '',
            address: '',
            gender: '',
            age: '',
            phone: '',
            password: ''
        });
        setStatusDialogOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAddUser = () => {
        setIsAdding(true);
        setOpen(true);
        setFormData({
            username: '',
            email: '',
            name: '',
            address: '',
            gender: '',
            age: '',
            phone: '',
            password: ''
        });
    };

    const handleSave = () => {
        if (isAdding) {
            axios.post('http://localhost:5000/api/admins/user', formData)
                .then(response => {
                    setUsers([...users, response.data]);
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error adding the user!", error);
                });
        } else {
            axios.put(`http://localhost:5000/api/admins/user/${selectedUser._id}`, formData)
                .then(response => {
                    setUsers(prevUsers => prevUsers.map(user => user._id === response.data._id ? response.data : user));
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error updating the user!", error);
                });
        }
    };

    const handleToggleStatus = (userId, currentStatus) => {
        setSelectedUser(users.find(user => user._id === userId));
        setStatusToChange(currentStatus === 'active' ? 'blocked' : 'active');
        setStatusDialogOpen(true);
    };

    const handleStatusConfirm = () => {
        if (selectedUser) {
            axios.put(`http://localhost:5000/api/admins/user/${selectedUser._id}`, { status: statusToChange })
                .then(response => {
                    setUsers(prevUsers => prevUsers.map(user => user._id === response.data._id ? response.data : user));
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error updating the user status!", error);
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

    const handleViewUser = (userId) => {
        history.push(`/api/user/${userId}`);
    };

    const getStatusIcon = (status, userId) => {
        switch (status) {
            case 'active':
                return (
                    <IconButton color="success" onClick={() => handleToggleStatus(userId, status)}>
                        <CheckCircleIcon />
                    </IconButton>
                );
            case 'blocked':
                return (
                    <IconButton color="error" onClick={() => handleToggleStatus(userId, status)}>
                        <BlockIcon />
                    </IconButton>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ marginLeft: '250px' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{getStatusIcon(user.status, user._id)}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleRowClick(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="info" onClick={() => handleViewUser(user._id)}>
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
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                style={{ marginTop: 16 }}
                onClick={handleAddUser}
            >
                Add User
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isAdding ? 'Add User' : 'Edit User'}</DialogTitle>
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
                        name="gender"
                        label="Gender"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.gender}
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
                        name="phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.phone}
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

            <Dialog open={statusDialogOpen} onClose={handleClose}>
                <DialogTitle>Confirm {statusToChange}</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to confirn this User to {statusToChange}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleStatusConfirm} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default HomeAdmin;
