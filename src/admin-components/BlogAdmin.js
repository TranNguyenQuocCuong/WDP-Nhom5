import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions,
    Typography, IconButton, TablePagination
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

function BlogAdmin() {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:5000/api/admins/blog')
            .then(response => {
                setBlogs(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the blogs!", error);
            });
    }, []);

    const handleRowClick = (blog) => {
        setSelectedBlog(blog);
        setOpen(true);
        setIsAdding(false);
        setFormData({
            title: blog.title || '',
            content: blog.content || ''
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBlog(null);
        setIsAdding(false);
        setFormData({
            title: '',
            content: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAddBlog = () => {
        setIsAdding(true);
        setOpen(true);
        setFormData({
            title: '',
            content: ''
        });
    };

    const handleSave = () => {
        if (isAdding) {
            axios.post('http://localhost:5000/api/admins/blog', formData)
                .then(response => {
                    setBlogs([...blogs, response.data]);
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error adding the blog!", error);
                });
        } else {
            axios.put(`http://localhost:5000/api/admins/blog/${selectedBlog._id}`, formData)
                .then(response => {
                    setBlogs(prevBlogs => prevBlogs.map(blog => blog._id === response.data._id ? response.data : blog));
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error updating the blog!", error);
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

    const handleViewBlog = (blogId) => {
        history.push(`/admin/blog/${blogId}`);
    };

    return (
        <div style={{ marginLeft: '250px' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog, index) => (
                            <TableRow key={blog._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{blog.title}</TableCell>
                                <TableCell>{blog.content.substring(0, 100)}...</TableCell>
                                <TableCell>{blog.author}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleRowClick(blog)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="info" onClick={() => handleViewBlog(blog._id)}>
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
                    count={blogs.length}
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
                onClick={handleAddBlog}
            >
                Add Blog
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isAdding ? 'Add Blog' : 'Edit Blog'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="content"
                        label="Content"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.content}
                        onChange={handleInputChange}
                    />
                    
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

export default BlogAdmin;
