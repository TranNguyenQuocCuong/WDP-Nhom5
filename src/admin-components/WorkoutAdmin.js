import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions,
    IconButton, TablePagination, InputAdornment
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

function WorkoutAdmin() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        video: '',
        description: '',
        courseId: ''
    });
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:5000/api/workouts')
            .then(response => {
                const normalizedWorkouts = response.data.map(workout => ({
                    ...workout,
                    courseId: typeof workout.courseId === 'object' ? workout.courseId : { _id: workout.courseId, name: '' }
                }));
                setWorkouts(normalizedWorkouts);
            })
            .catch(error => {
                console.error("There was an error fetching the workouts!", error);
            });

        axios.get('http://localhost:5000/api/admins/course')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the courses!", error);
            });
    }, []);

    const filteredWorkouts = workouts.filter(workout =>
        workout.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (workout) => {
        setSelectedWorkout(workout);
        setOpen(true);
        setIsAdding(false);
        setFormData({
            name: workout.name || '',
            video: workout.video || '',
            description: workout.description || '',
            courseId: workout.courseId._id || ''
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedWorkout(null);
        setIsAdding(false);
        setFormData({
            name: '',
            video: '',
            description: '',
            courseId: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddWorkout = () => {
        setIsAdding(true);
        setOpen(true);
        setFormData({
            name: '',
            video: '',
            description: '',
            courseId: ''
        });
    };

    const handleSave = () => {
        if (isAdding) {
            axios.post('http://localhost:5000/api/workouts', formData)
                .then(response => {
                    const newWorkout = response.data;
                    const course = courses.find(course => course._id === newWorkout.courseId);
                    newWorkout.courseId = { _id: newWorkout.courseId, name: course ? course.name : '' };
                    setWorkouts([...workouts, newWorkout]);
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error adding the workout!", error);
                });
        } else {
            axios.put(`http://localhost:5000/api/workouts/${selectedWorkout._id}`, formData)
                .then(response => {
                    const updatedWorkout = response.data;
                    const course = courses.find(course => course._id === updatedWorkout.courseId);
                    updatedWorkout.courseId = { _id: updatedWorkout.courseId, name: course ? course.name : '' };
                    setWorkouts(prevWorkouts => prevWorkouts.map(workout => workout._id === updatedWorkout._id ? updatedWorkout : workout));
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error updating the workout!", error);
                });
        }
    };

    const handleDelete = (workoutId) => {
        axios.delete(`http://localhost:5000/api/workouts/${workoutId}`)
            .then(() => {
                setWorkouts(prevWorkouts => prevWorkouts.filter(workout => workout._id !== workoutId));
            })
            .catch(error => {
                console.error("There was an error deleting the workout!", error);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewWorkout = (workoutId) => {
        history.push(`/workouts/${workoutId}`);
    };

    return (
        <div style={{ marginLeft: '250px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddWorkout}
                >
                    Add Workout
                </Button>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Video</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredWorkouts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((workout, index) => (
                            <TableRow key={workout._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{workout.name}</TableCell>
                                <TableCell>
                                    <a href={`https://www.youtube.com/watch?v=${workout.video}`} target="_blank" rel="noopener noreferrer">
                                        View Video
                                    </a>
                                </TableCell>
                                <TableCell>{workout.description}</TableCell>
                                <TableCell>{workout.courseId.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleRowClick(workout)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(workout._id)}>
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
                    count={filteredWorkouts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isAdding ? 'Add Workout' : 'Edit Workout'}</DialogTitle>
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
                        name="video"
                        label="Video URL"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.video}
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
                        name="courseId"
                        label="Course"
                        select
                        fullWidth
                        variant="outlined"
                        SelectProps={{
                            native: true,
                        }}
                        value={formData.courseId}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>Select Course</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                    </TextField>
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

export default WorkoutAdmin;
