import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions,
    IconButton, TablePagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

function CourseAdmin() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        time: '',
        price: '',
        action: true
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:5000/api/admins/course')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the courses!", error);
            });
    }, []);

    const handleRowClick = (course) => {
        setSelectedCourse(course);
        setOpen(true);
        setIsAdding(false);
        setFormData({
            name: course.name || '',
            description: course.description || '',
            time: course.time || '',
            price: course.price || '',
            action: course.action || true
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCourse(null);
        setIsAdding(false);
        setFormData({
            name: '',
            description: '',
            time: '',
            price: '',
            action: true
        });
    };

    const handleInputChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddCourse = () => {
        setIsAdding(true);
        setOpen(true);
        setFormData({
            name: '',
            description: '',
            time: '',
            price: '',
            action: true
        });
    };

    const handleSave = () => {
        if (isAdding) {
            axios.post('http://localhost:5000/api/admins/course', formData)
                .then(response => {
                    setCourses([...courses, response.data]);
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error adding the course!", error);
                });
        } else {
            axios.put(`http://localhost:5000/api/admins/course/${selectedCourse._id}`, formData)
                .then(response => {
                    setCourses(prevCourses => prevCourses.map(course => course._id === response.data._id ? response.data : course));
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error updating the course!", error);
                });
        }
    };

    const handleDelete = (courseId) => {
        axios.delete(`http://localhost:5000/api/admins/course/${courseId}`)
            .then(() => {
                setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
            })
            .catch(error => {
                console.error("There was an error deleting the course!", error);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewCourse = (courseId) => {
        history.push(`/courses/${courseId}`);
    };

    return (
        <div style={{ marginLeft: '250px' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course, index) => (
                            <TableRow key={course._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.description}</TableCell>
                                <TableCell>{course.time}</TableCell>
                                <TableCell>{course.price}</TableCell>
                                <TableCell>{course.action ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleRowClick(course)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="info" onClick={() => handleViewCourse(course._id)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(course._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={courses.length}
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
                onClick={handleAddCourse}
            >
                Add Course
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isAdding ? 'Add Course' : 'Edit Course'}</DialogTitle>
                <DialogContent>
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
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="time"
                        label="Time (month)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.time}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            margin="dense"
                            name="action"
                            label="Action"
                            type="checkbox"
                            checked={formData.action}
                            onChange={handleInputChange}
                            style={{ marginRight: 8 }} // Adjust spacing as needed
                        />
                        <span>Is In Sale</span> {/* Replace with desired text */}
                    </div>
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

export default CourseAdmin;
