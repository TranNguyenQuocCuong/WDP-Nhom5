import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './CartScreen.css';
import { MdDelete } from 'react-icons/md'; // Import delete icon from react-icons
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartScreen = () => {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isFormValid, setIsFormValid] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchProfile();
        }
    }, []);

    useEffect(() => {
        validateForm();
    }, [address, paymentMethod, cart]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/userProfile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUserId(response.data._id);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Please log in to proceed with payment.');
            setIsLoggedIn(false);
        }
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((total, product) => total + product.price * product.quantity, 0);
        const tax = (subtotal * 0.1);
        const shipping = address ? 20000 : 0;
        const total = (subtotal + parseFloat(tax) + shipping);
        return { subtotal, tax, shipping, total };
    };

    const totals = calculateTotals();

    const handleRemove = (productId) => {
        removeFromCart(productId);
        toast.info('Product removed from cart.');
    };

    const handleQuantityChange = (productId, event) => {
        const quantity = parseInt(event.target.value, 10);
        if (isNaN(quantity) || quantity <= 0) {
            toast.info('Quantity must be greater than 0.');
            return;
        }
        updateQuantity(productId, quantity);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const validateForm = () => {
        // Validate address, payment method, and cart items
        const isValid = paymentMethod && cart.length > 0;
        setIsFormValid(isValid);
    };

    const handlePayment = async () => {
        if (!isLoggedIn) {
            toast.error('Please log in to proceed with payment.');
            return;
        }

        if (!isFormValid) {
            toast.error('Please complete all required fields before proceeding.');
            return;
        }

        const orderItems = cart.map(product => ({
            name: product.name,
            qty: product.quantity,
            image: product.image,
            price: product.price,
            product: product._id
        }));

        const orderData = {
            user: userId,
            orderItems,
            paymentMethod,
            itemsPrice: totals.subtotal,
            shippingAddress: address,
            totalPrice: totals.total,
            isPaid: false,
            isDelivered: false
        };

        try {
            const orderResponse = await axios.post('http://localhost:5000/api/order', orderData);
            const { payUrl } = orderResponse.data;

            if (paymentMethod === 'MoMo') {
                window.location.href = payUrl;
            } else if (paymentMethod === 'VnPay') {
                window.location.href = payUrl;
            }

            toast.success('Order placed successfully.');
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(`Error creating order: ${error.response ? error.response.data.message : error.message}`);
        }

    };

    return (
        <div className="cart-screen">
            <ToastContainer />
            <div className="cart-content">
                <div className="cart-items">
                    {cart.length === 0 ? (
                        <p style={{ textAlign: 'center', width: '100%', margin: '0' }}>
                            Your cart is empty.
                        </p>
                    ) : (
                        <ul>
                            {cart.map((product) => (
                                <li key={product._id} className="cart-item">
                                    <img src={product.image} alt={product.name} className="cart-item-image" />
                                    <div className="cart-item-info">
                                        <span>{product.name}</span>
                                        <span>{product.price}đ</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={product.quantity}
                                            onChange={(event) => handleQuantityChange(product._id, event)}
                                            className="cart-item-quantity"
                                        />
                                        <MdDelete
                                            onClick={() => handleRemove(product._id)}
                                            className="remove-icon"
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="cart-address-payment-summary">
                    <div className="cart-address-payment">
                        <div className="address-form">
                            <h3>Shipping Address</h3>
                            <textarea
                                value={address}
                                onChange={handleAddressChange}
                                placeholder="Enter your address"
                            />
                        </div>
                        <div className="payment-method">
                            <h3>Payment Method</h3>
                            <label>
                                <input
                                    type="radio"
                                    value="MoMo"
                                    checked={paymentMethod === 'MoMo'}
                                    onChange={handlePaymentMethodChange}
                                />
                                MoMo
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="VnPay"
                                    checked={paymentMethod === 'VnPay'}
                                    onChange={handlePaymentMethodChange}
                                />
                                VnPay
                            </label>
                        </div>
                    </div>
                    <div className="cart-summary">
                        <p>Total Items: {cart.reduce((total, product) => total + product.quantity, 0)}</p>
                        <p>Subtotal: {totals.subtotal}đđ</p>
                        <hr className="divider" />
                        <p>Tax (10%): {totals.tax}đ</p>
                        {address && <p>Shipping Price: {totals.shipping}đ</p>}
                        <hr className="divider" />
                        <p style={{ marginTop: '10px' }}>Total Price: {totals.total}đ</p>
                        <button
                            className="payment-button"
                            onClick={handlePayment}
                            disabled={!isFormValid}
                        >
                            Place Order
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;
