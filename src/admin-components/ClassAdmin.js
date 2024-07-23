import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, Typography, IconButton, TablePagination,
    Select, MenuItem, FormControl, InputLabel, Button, DialogActions
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';

function ClassAdmin() {
    const [coaches, setCoaches] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [advisedUsers, setAdvisedUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [viewingAdvisedUsers, setViewingAdvisedUsers] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        axios.get('http://localhost:5000/api/admins/coach')
            .then(response => {
                setCoaches(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the coaches!", error);
            });

        axios.get('http://localhost:5000/api/admins/user')
            .then(response => {
                setUsers(response.data);
                console.log("Users fetched:", response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
            });
    }, []);

    const handleViewCoach = (coachId) => {
        axios.get(`http://localhost:5000/api/admins/coach/${coachId}`)
            .then(response => {
                setSelectedCoach(response.data);
                setAdvisedUsers(response.data.advisedUsers);
                console.log("Advised Users fetched:", response.data.advisedUsers);
                setViewingAdvisedUsers(true);
                setOpen(true);
            })
            .catch(error => {
                console.error("There was an error fetching the coach details!", error);
            });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCoach(null);
        setAdvisedUsers([]);
        setViewingAdvisedUsers(false);
        setSelectedUsers([]);
    };

    const handleAddAdvisedUsers = () => {
        if (selectedCoach) {
            axios.put(`http://localhost:5000/api/admins/coach/${selectedCoach._id}/advisedUsers`, {
                userIds: selectedUsers
            })
                .then(response => {
                    setAdvisedUsers(response.data.advisedUsers);
                    setViewingAdvisedUsers(true);
                })
                .catch(error => {
                    console.error("There was an error adding advised users!", error);
                });
        }
    };

    const handleRemoveAdvisedUsers = (userIds) => {
        if (selectedCoach) {
            axios.delete(`http://localhost:5000/api/admins/coach/${selectedCoach._id}/advisedUsers`, {
                data: { userIds }
            })
                .then(response => {
                    setAdvisedUsers(response.data.advisedUsers);
                })
                .catch(error => {
                    console.error("There was an error removing advised users!", error);
                });
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
                            <TableCell>Address</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coaches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((coach, index) => (
                            <TableRow key={coach._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{coach.username}</TableCell>
                                <TableCell>{coach.email}</TableCell>
                                <TableCell>{coach.name}</TableCell>
                                <TableCell>{coach.address}</TableCell>
                                <TableCell>{coach.age}</TableCell>
                                <TableCell>
                                    {/* <IconButton color="info" onClick={() => handleViewCoach(coach._id)}>
                                        <VisibilityIcon />
                                    </IconButton> */}
                                    <IconButton color="info" onClick={() => {
                                        setSelectedCoach(coach);
                                        setViewingAdvisedUsers(false);
                                        setOpen(true);
                                    }}>
                                        <AddIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={coaches.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Advised Users</DialogTitle>
                <DialogContent>
                    {viewingAdvisedUsers ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {advisedUsers.map((user, index) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <IconButton color="error" onClick={() => handleRemoveAdvisedUsers([user._id])}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <>
                            <FormControl fullWidth>
                                <InputLabel id="select-user-label">Select Users</InputLabel>
                                <Select
                                    labelId="select-user-label"
                                    multiple
                                    value={selectedUsers}
                                    onChange={(event) => setSelectedUsers(event.target.value)}
                                >
                                    {users.map((user) => (
                                        <MenuItem key={user._id} value={user._id}>
                                            {user.username}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {viewingAdvisedUsers ? (
                        <Button onClick={handleClose} color="primary">Close</Button>
                    ) : (
                        <>
                            <Button onClick={handleAddAdvisedUsers} color="primary">Add Users</Button>
                            <Button onClick={handleClose} color="secondary">Close</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClassAdmin;
