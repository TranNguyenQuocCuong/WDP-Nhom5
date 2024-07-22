import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

export default function MonthlyPlan() {
    const history = useHistory();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [subscribedCourses, setSubscribedCourses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCoursePrice, setSelectedCoursePrice] = useState(null);

    useEffect(() => {
        // Fetch user data to check subscribedCourses
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/userProfile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSubscribedCourses(response.data.subscribedCourses || []);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Fetch course data
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/buy/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchUserData();
        fetchCourses();
    }, []);

    // const handleButtonClick = (price) => {
    //     setSelectedCoursePrice(price);
    //     setIsPopupVisible(true);
    // };

    // const handleClosePopup = () => {
    //     setIsPopupVisible(false);
    // };

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

    // const handleBuyVnpay = (price) => {
    //     const data = {
    //         coursePrice: price
    //     };

    //     axios.post('http://localhost:5000/api/payments/vnppayment', data)
    //         .then(response => {
    //             const { payUrl } = response.data;
    //             console.log('Success:', payUrl);
    //             window.open(payUrl);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             window.open('http://localhost:3000/view-workout-course', '_blank');
    //         });
    // };

    // const handleBuyMomo = (price) => {
    //     const data = {
    //         coursePrice: price
    //     };

    //     axios.post('http://localhost:5000/api/payments/momopayment', data)
    //         .then(response => {
    //             const { payUrl } = response.data;
    //             console.log('Success:', payUrl);
    //             window.open(payUrl);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             window.open('http://localhost:3000/view-workout-course', '_blank');
    //         });
    // };

    const handleDivClick = () => {
        history.push('/courseDetail');
    };

    const handleEnrollNow = (course) => {
        history.push({
            pathname: '/billing',
            state: { course }
        });
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
                    {courses.map((course) => (
                        <div key={course._id} className="col-lg-4 col-md-8">
                            <div className="ps-item text-center mb-4">
                                <h3 className="mb-4">{course.name}</h3>
                                <div className="pi-price mb-4">
                                    <h2>{course.price} VNĐ</h2>
                                    <span>{course.description}</span>
                                </div>
                                <ul className="list-group mb-4">
                                    <li>Free Riding</li>
                                    <li>Unlimited equipments</li>
                                    <li>Personal Trainer</li>
                                    <li>Weight losing classes</li>
                                    <li>No time restriction</li>
                                    <li>Monthly Something</li>
                                </ul>
                                {/* <div className="d-grid gap-2">
                                    {subscribedCourses.length === 0 ? (
                                        <button
                                            className="btn btn-primary text-white rounded-0 text-decoration-none"
                                            onClick={() => handleButtonClick(course.price)}
                                            disabled={!course.action}
                                        >
                                            Enroll now
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary text-white rounded-0 text-decoration-none"
                                            disabled
                                        >
                                            In Use
                                        </button>
                                    )}
                                </div> */}
                                <div className="d-grid gap-2">
                                    {subscribedCourses.length === 0 ? (
                                        <button
                                            className="btn btn-primary text-white rounded-0 text-decoration-none"
                                            onClick={() => handleEnrollNow(course)}
                                            disabled={!course.action}
                                        >
                                            Enroll now
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary text-white rounded-0 text-decoration-none"
                                            disabled
                                        >
                                            In Use
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* {isPopupVisible && (
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
                    )} */}
                </div>
            </div>
        </section>
    );
}