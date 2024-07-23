import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function MonthlyPlan() {
    const history = useHistory();
    const [subscribedCourses, setSubscribedCourses] = useState([]);
    const [courses, setCourses] = useState([]);

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

    const handleEnrollNow = (course) => {
        history.push({
            pathname: '/billing',
            state: { course }
        });
    };

    const isCourseSubscribed = (courseId) => {
        return subscribedCourses.includes(courseId);
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
                                <div className="d-grid gap-2">
                                    {course.action ? (
                                        isCourseSubscribed(course._id) ? (
                                            <button className="btn btn-primary text-white rounded-0 text-decoration-none" disabled>
                                                In Use
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary text-white rounded-0 text-decoration-none"
                                                onClick={() => handleEnrollNow(course)}
                                            >
                                                Enroll now
                                            </button>
                                        )
                                    ) : (
                                        <button className="btn btn-secondary text-white rounded-0 text-decoration-none" disabled>
                                            Not Active
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
