import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Paper, CircularProgress, Snackbar, Avatar } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';

const ProductAdminScreen = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [image, setImage] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCreate = async (product) => {
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            const newProduct = await response.json();
            setProducts([...products, newProduct]);
            setSuccessMessage('Product created successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            setError(error.message);
            setSnackbarOpen(true);
        }
    };

    const handleUpdate = async (id, product) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            const updatedProduct = await response.json();
            setProducts(products.map(p => p._id === id ? updatedProduct : p));
            setSuccessMessage('Product updated successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            setError(error.message);
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setProducts(products.filter(p => p._id !== id));
            setSuccessMessage('Product deleted successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            setError(error.message);
            setSnackbarOpen(true);
        }
    };

    const handleDialogOpen = (product = null) => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCountInStock(product.countInStock);
            setImage(product.image);
            setSelectedProductId(product._id);
            setIsEditMode(true);
        } else {
            setName('');
            setPrice('');
            setDescription('');
            setCountInStock('');
            setImage('');
            setSelectedProductId(null);
            setIsEditMode(false);
        }
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleSaveProduct = () => {
        const product = { name, price, description, countInStock, image };
        if (isEditMode) {
            handleUpdate(selectedProductId, product);
        } else {
            handleCreate(product);
        }
        handleDialogClose();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: '16px', marginLeft: '240px' }}>
            <Typography variant="h4" gutterBottom>
                Product Admin
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleDialogOpen()}
                style={{ marginBottom: '20px' }}
            >
                Add New Product
            </Button>

            <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>{isEditMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        margin="dense"
                        label="Count In Stock"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        margin="dense"
                        label="Image URL"
                        fullWidth
                        variant="outlined"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveProduct} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Paper style={{ padding: '20px' }}>
                <List>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ListItem key={product._id} divider>
                                <Avatar src={product.image} alt={product.name} style={{ marginRight: '16px' }} />
                                <ListItemText
                                    primary={product.name}
                                    secondary={`Price: ${product.price}đ`}
                                />
                                <IconButton color="primary" onClick={() => handleDialogOpen(product)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleDelete(product._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No products available" />
                        </ListItem>
                    )}
                </List>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert onClose={handleSnackbarClose} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
                    {successMessage || error}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default ProductAdminScreen;
