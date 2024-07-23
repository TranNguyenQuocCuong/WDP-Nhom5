import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, IconButton, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, InputLabel, MenuItem, FormControl
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useHistory } from 'react-router-dom';  // Import useHistory

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

function TransactionsAdminNav() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tab, setTab] = useState(0); // For tab navigation
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [username, setUsername] = useState('');
    const history = useHistory();  // Use useHistory

    useEffect(() => {
        axios.get('http://localhost:5000/api/admins/transactions', {
            params: { startDate, endDate, username }
        })
            .then(response => {
                if (Array.isArray(response.data.transactions)) {
                    setTransactions(response.data.transactions);
                } else {
                    console.error("The response data is not an array:", response.data);
                    setTransactions([]);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the transactions!", error);
                setTransactions([]);
            });
    }, [startDate, endDate, username]);

    useEffect(() => {
        // Apply date and username filtering
        const filtered = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);

            const isDateInRange = (!startDate || transactionDate >= start) &&
                (!endDate || transactionDate <= end);
            const isUsernameMatch = !username || transaction.user.username.toLowerCase().includes(username.toLowerCase());

            return isDateInRange && isUsernameMatch;
        });
        setFilteredTransactions(filtered);
    }, [transactions, startDate, endDate, username]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTransaction(null);
    };

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        if (name === 'startDate') setStartDate(value);
        if (name === 'endDate') setEndDate(value);
        if (name === 'username') setUsername(value);
    };

    // Prepare data for the line chart
    const chartData = {
        labels: transactions.map(tx => new Date(tx.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Total Price',
                data: transactions.map(tx => tx.totalPrice),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div style={{ marginLeft: '250px', padding: 16 }}>
            <Tabs value={tab} onChange={handleChangeTab} aria-label="tabs">
                <Tab label="Table" />
                <Tab label="Chart" />
            </Tabs>

            {tab === 0 && (
                <div>
                    <div style={{ marginBottom: 16 }}>
                        <FormControl style={{ marginRight: 16, minWidth: 120 }}>

                            <TextField
                                type="date"
                                name="startDate"
                                value={startDate}
                                onChange={handleFilterChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                        <FormControl style={{ marginRight: 16, minWidth: 120 }}>

                            <TextField
                                type="date"
                                name="endDate"
                                value={endDate}
                                onChange={handleFilterChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                        <FormControl style={{ minWidth: 120 }}>
                            {/* <InputLabel>Username</InputLabel> */}
                            <TextField
                                type="text"
                                name="username"
                                value={username}
                                onChange={handleFilterChange}
                            />
                        </FormControl>
                    </div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Transaction ID</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction, index) => (
                                    <TableRow key={transaction._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{transaction._id}</TableCell>
                                        <TableCell>{transaction.totalPrice}</TableCell>
                                        <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{transaction.user.username}</TableCell>
                                        <TableCell>
                                            <IconButton color="info" onClick={() => handleViewTransaction(transaction)}>
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
                            count={filteredTransactions.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </div>
            )}

            {tab === 1 && (
                <div style={{ marginTop: 16 }}>
                    <Line data={chartData} />
                </div>
            )}

            {/* Dialog for transaction details */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogContent>
                    {selectedTransaction && (
                        <div>
                            <h4>Transaction ID: {selectedTransaction._id}</h4>
                            <p><strong>Username:</strong> {selectedTransaction.user.username}</p>
                            <p><strong>Name:</strong> {selectedTransaction.user.name}</p>
                            <p><strong>Email:</strong> {selectedTransaction.user.email}</p>
                            <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
                            <p><strong>Shipping Address:</strong> {selectedTransaction.shippingAddress}</p>
                            <p><strong>Items Price:</strong> {selectedTransaction.itemsPrice}</p>
                            <p><strong>Total Price:</strong> {selectedTransaction.totalPrice}</p>
                            <p><strong>Paid:</strong> {selectedTransaction.isPaid ? 'Yes' : 'No'}</p>
                            <p><strong>Delivered:</strong> {selectedTransaction.isDelivered ? 'Yes' : 'No'}</p>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedTransaction.orderItems.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <img src={item.image} alt={item.name} style={{ width: 50, height: 50 }} />
                                                </TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.qty}</TableCell>
                                                <TableCell>{item.price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TransactionsAdminNav;
