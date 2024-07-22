import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import ChartJS from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Import the date adapter for time-based charts
import { FaEye } from 'react-icons/fa';
import './UserTransactions.css';

const UserTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState({});
    const [activeTab, setActiveTab] = useState('list');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const token = localStorage.getItem('token');
    const popupRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/userProfile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userId = response.data._id;
                const transactionResponse = await axios.get(`http://localhost:5000/api/users/${userId}/transactions`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const transactions = transactionResponse.data;
                transactions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                const labels = transactions.map(transaction => new Date(transaction.createdAt));
                const data = transactions.map(transaction => transaction.totalPrice);
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Spending History',
                            data: data,
                            fill: false,
                            borderColor: 'rgba(75,192,192,1)',
                            tension: 0.1
                        }
                    ]
                });
                setTransactions(transactions);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchProfile();
    }, [token]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleViewClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedTransaction(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleClosePopup();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="user-transactions">
            <div className="tabs">
                <button className={`tab-button ${activeTab === 'list' ? 'active' : ''}`} onClick={() => handleTabChange('list')}>Transaction List</button>
                <button className={`tab-button ${activeTab === 'chart' ? 'active' : ''}`} onClick={() => handleTabChange('chart')}>Spending Chart</button>
            </div>
            {activeTab === 'list' && (
                <div className="transaction-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Payment Method</th>
                                <th>Items Price</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction._id}>
                                    <td>{transaction._id}</td>
                                    <td>{transaction.paymentMethod}</td>
                                    <td>{transaction.itemsPrice}đ</td>
                                    <td>{transaction.totalPrice}đ</td>
                                    <td>{transaction.isPaid ? 'Paid' : 'Unpaid'}</td>
                                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleViewClick(transaction)} className="view-button">
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {activeTab === 'chart' && (
                <div className="chart-container">
                    <Line data={chartData} options={{
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day',
                                    tooltipFormat: 'MMM D, YYYY h:mm:ss a'
                                },
                                title: {
                                    display: true,
                                    text: 'Date & Time'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Total Price (đ)'
                                }
                            }
                        }
                    }} />
                </div>
            )}
            {isPopupOpen && selectedTransaction && (
                <div className="popup-overlay">
                    <div className="popup-content" ref={popupRef}>
                        <button className="close-button" onClick={handleClosePopup}>×</button>
                        <h2>Transaction Details</h2>
                        <p><strong>Order ID:</strong> {selectedTransaction._id}</p>
                        <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod}</p>
                        <p><strong>Items Price:</strong> {selectedTransaction.itemsPrice}đ</p>
                        <p><strong>Total Price:</strong> {selectedTransaction.totalPrice}đ</p>
                        <p><strong>Status:</strong> {selectedTransaction.isPaid ? 'Paid' : 'Unpaid'}</p>
                        <p><strong>Date:</strong> {new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                        <h3>Order Items</h3>
                        <table className="order-items-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedTransaction.orderItems.map(item => (
                                    <tr key={item._id}>
                                        <td><img src={item.image} alt={item.name} className="item-image" /></td>
                                        <td>{item.name}</td>
                                        <td>{item.qty}</td>
                                        <td>{item.price}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTransactions;
