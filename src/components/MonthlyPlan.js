import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

export default function MonthlyPlan() {
    const history = useHistory();
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleButtonClick = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    const handleBuyNow = (price) => {
        const data = {
            coursePrice: price
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

    const handleBuyVnpay = (price) => {
        const data = {
            coursePrice: price
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

    const handleBuyMomo = (price) => {
        const data = {
            coursePrice: price
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

    const handleDivClick = () => {
        history.push('/courseDetail');
    };

    return (
        <section id="section7" className="mb-4 pt-3">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center my-5">
                        <h6 className="my-3 fw-bold">OUR PLAN</h6>
                        <h2 className="display-6">CHOOSE YOUR PRICING PLAN</h2>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-8">
                        <div className="ps-item text-center mb-4">
                            <h3 className="mb-4">Class drop-in</h3>
                            <div className="pi-price mb-4">
                                <h2>$ 39.0</h2>
                                <span>SINGLE CLASS</span>
                            </div>
                            <ul className="list-group mb-4">
                                <li>Free Riding</li>
                                <li>Unlimited equipments</li>
                                <li>Personal Trainer</li>
                                <li>Weight losing classes</li>
                                <li>No time restriction</li>
                                <li>Monthly Something</li>
                            </ul>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary text-white rounded-0 text-decoration-none" onClick={handleButtonClick}>
                                    Enroll now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-8">
                        <div className="ps-item text-center mb-4">
                            <h3 className="mb-4">Class drop-in</h3>
                            <div className="pi-price mb-4">
                                <h2>$ 39.0</h2>
                                <span>SINGLE CLASS</span>
                            </div>
                            <ul className="list-group mb-4">
                                <li>Free Riding</li>
                                <li>Unlimited equipments</li>
                                <li>Personal Trainer</li>
                                <li>Weight losing classes</li>
                                <li>No time restriction</li>
                                <li>Monthly Something</li>
                            </ul>
                            <div className="d-grid gap-2">
                                <Link to="/checkout" className="btn btn-primary text-white rounded-0 text-decoration-none">
                                    Enroll now
                                </Link>
                            </div>
                        </div>
                    </div>

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
                                            onClick={() => handleBuyMomo(750000)}
                                        />
                                    </div>
                                    <div className="payment-option">
                                        <img
                                            src="https://admin.softmaster.vn/_default_upload_bucket/154573132_152687123342645_1913382004205201124_n.png"
                                            alt="VNPay"
                                            className="payment-image"
                                            onClick={() => handleBuyVnpay(750000)}
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
            </div>
        </section>
    );
}
