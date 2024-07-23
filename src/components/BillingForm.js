import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function BillingForm() {
    const history = useHistory();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedCoursePrice, setSelectedCoursePrice] = useState(null);
    const location = useLocation();
    const { course } = location.state;

    const [billingInfo, setBillingInfo] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
    });

    const handleButtonClick = (price) => {
        setSelectedCoursePrice(price);
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo({
            ...billingInfo,
            [name]: value,
        });
    };

    const handleBuyMomo = (price) => {
        const data = {
            coursePrice: price,
            name: billingInfo.name,
            email: billingInfo.email,
            phone: billingInfo.phone,
            courseId: course._id
        };

        axios.post('http://localhost:5000/api/payments/momopayment', data)
            .then(response => {
                const { payUrl } = response.data;
                console.log('Success:', payUrl);
                window.open(payUrl);
            })
            .catch(error => {
                console.error('Error:', error);
                window.open('http://localhost:3000/view-workout-course', '_blank');
            });
    };

    const handleBuyVnpay = (price) => {
        const data = {
            coursePrice: price,
            name: billingInfo.name,
            email: billingInfo.email,
            phone: billingInfo.phone,
            courseId: course._id
        };

        axios.post('http://localhost:5000/api/payments/vnppayment', data)
            .then(response => {
                const { payUrl } = response.data;
                console.log('Success:', payUrl);
                window.open(payUrl);
            })
            .catch(error => {
                console.error('Error:', error);
                window.open('http://localhost:3000/view-workout-course', '_blank');
            });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleButtonClick(course.price);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/users/userProfile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const { name, email, phone } = response.data;
                    setBillingInfo({
                        ...billingInfo,
                        name,
                        email,
                        phone
                    });
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });
        }
    }, []);

    return (
        <div className="container mt-5">
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="courseName" className="form-label">Course Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="courseName"
                        name="courseName"
                        value={course.name}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="coursePrice" className="form-label">Course Price</label>
                    <input
                        type="text"
                        className="form-control"
                        id="coursePrice"
                        name="coursePrice"
                        value={`${course.price} VNĐ`}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={billingInfo.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={billingInfo.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={billingInfo.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Payment</button>
            </form>
            {isPopupVisible && (
                <div className="popup">
                    <div className="popup-inner">
                        <h2 className="">Choose Payment Method</h2>
                        <div className="payment-options">
                            <div className="payment-option">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                    alt="MoMo"
                                    className="payment-image"
                                    onClick={() => handleBuyMomo(selectedCoursePrice)}
                                />
                            </div>
                            <div className="payment-option">
                                <img
                                    src="https://admin.softmaster.vn/_default_upload_bucket/154573132_152687123342645_1913382004205201124_n.png"
                                    alt="VNPay"
                                    className="payment-image"
                                    onClick={() => handleBuyVnpay(selectedCoursePrice)}
                                />
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <button className="btn btn-secondary" onClick={handleClosePopup}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
