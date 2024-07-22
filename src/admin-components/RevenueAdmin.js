import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions,
    IconButton, TablePagination, Tabs, Tab
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import moment from 'moment';

function RevenueAdmin() {
    const [revenues, setRevenues] = useState([]);
    const [selectedRevenue, setSelectedRevenue] = useState(null);
    const [open, setOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        amount: '',
        planId: '',
        userId: ''
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tabValue, setTabValue] = useState(0); // State to manage active tab

    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:5000/api/revenue')
            .then(response => {
                console.log(response.data); // Kiểm tra dữ liệu
                setRevenues(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the revenues!", error);
            });
    }, []);

    const handleRowClick = (revenue) => {
        setSelectedRevenue(revenue);
        setOpen(true);
        setIsAdding(false);
        setFormData({
            date: new Date(revenue.date).toISOString().slice(0, 16),
            amount: revenue.amount || '',
            planId: revenue.planId || '',
            userId: revenue.userId ? revenue.userId._id : ''
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRevenue(null);
        setIsAdding(false);
        setFormData({
            date: '',
            amount: '',
            planId: '',
            userId: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAddRevenue = () => {
        setIsAdding(true);
        setOpen(true);
        setFormData({
            date: '',
            amount: '',
            planId: '',
            userId: ''
        });
    };

    const handleSave = () => {
        if (isAdding) {
            axios.post('http://localhost:5000/api/revenue', formData)
                .then(response => {
                    setRevenues([...revenues, response.data]);
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error adding the revenue!", error);
                });
        } else {
            axios.put(`http://localhost:5000/api/revenue/${selectedRevenue._id}`, formData)
                .then(response => {
                    setRevenues(prevRevenues => prevRevenues.map(revenue => revenue._id === response.data._id ? response.data : revenue));
                    handleClose();
                })
                .catch(error => {
                    console.error("There was an error updating the revenue!", error);
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

    const handleViewRevenue = (revenueId) => {
        history.push(`/api/revenue/${revenueId}`);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Prepare Chart Data
    const prepareChartData = () => {
        if (revenues.length === 0) return { labels: [], datasets: [] };

        const dates = revenues.map(r => moment(r.date).format('YYYY-MM-DD'));
        const amounts = revenues.map(r => r.amount);

        const chartData = {};
        dates.forEach((date, index) => {
            if (chartData[date]) {
                chartData[date] += amounts[index];
            } else {
                chartData[date] = amounts[index];
            }
        });

        const labels = Object.keys(chartData);
        const data = labels.map(label => chartData[label]);

        return {
            labels,
            datasets: [
                {
                    label: 'Revenue',
                    data,
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.1
                }
            ]
        };
    };

    return (
        <div style={{ marginLeft: '250px' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs">
                <Tab label="Table" />
                <Tab label="Chart" />
            </Tabs>

            {tabValue === 0 && (
                <div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Transaction Code</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>User Information</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {revenues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((revenue, index) => (
                                    <TableRow key={revenue._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{revenue.planId || 'N/A'}</TableCell>
                                        <TableCell>{new Date(revenue.date).toLocaleString()}</TableCell>
                                        <TableCell>{revenue.amount}</TableCell>
                                        <TableCell>
                                            {revenue.userId ? (
                                                <>
                                                    <div>Username: {revenue.userId.username}</div>
                                                    <div>Name: {revenue.userId.name}</div>
                                                    <div>Email: {revenue.userId.email}</div>
                                                </>
                                            ) : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleRowClick(revenue)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="info" onClick={() => handleViewRevenue(revenue._id)}>
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
                            count={revenues.length}
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
                        onClick={handleAddRevenue}
                    >
                        Add Revenue
                    </Button>

                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>{isAdding ? 'Add Revenue' : 'Edit Revenue'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                name="date"
                                label="Date"
                                type="datetime-local"
                                fullWidth
                                variant="outlined"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="amount"
                                label="Amount"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={formData.amount}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="planId"
                                label="Transaction Code"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.planId}
                                onChange={handleInputChange}
                            />
                            <TextField
                                margin="dense"
                                name="userId"
                                label="User ID"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.userId}
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
            )}

            {tabValue === 1 && (
                <div style={{ padding: 16 }}>
                    <Line data={prepareChartData()} />
                </div>
            )}
        </div>
    );
}

export default RevenueAdmin;
