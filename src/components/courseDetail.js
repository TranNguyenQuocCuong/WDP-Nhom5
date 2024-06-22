import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './courseDetail.css'; // Nếu bạn có stylesheet riêng cho trang chi tiết

const coursesData = [
    {
        id: '1',
        title: 'Course 1',
        image: '/path/to/image1.jpg',
        price: 39.0,
        description: 'This is the description for Course 1',
        details: ['Free Riding', 'Unlimited equipments', 'Personal Trainer', 'Weight losing classes', 'No time restriction', 'Monthly Something']
    },
    {
        id: '2',
        title: 'Course 2',
        image: '/path/to/image2.jpg',
        price: 49.0,
        description: 'This is the description for Course 2',
        details: ['Free Riding', 'Unlimited equipments', 'Personal Trainer', 'Weight losing classes', 'No time restriction', 'Monthly Something']
    },
    // Các khóa học khác
];

export default function CourseDetail() {
    const { courseId } = useParams();
    const course = coursesData.find(course => course.id === courseId);

    if (!course) {
        return <div className="container-lg container-fluid-lg mb-5">Course not found</div>;
    }

    return (
        <div className="container-lg container-fluid-lg mb-5">
            <div className="course-detail">
                <h1 className="mb-4">{course.title}</h1>
                <div className="course-image mb-4">
                    <img src={course.image} alt={course.title} className="img-fluid" />
                </div>
                <div className="course-info mb-4">
                    <h2 className="mb-3">${course.price}</h2>
                    <p>{course.description}</p>
                </div>
                <div className="course-details mb-4">
                    <h3>Details</h3>
                    <ul className="list-group">
                        {course.details.map((detail, index) => (
                            <li key={index} className="list-group-item">{detail}</li>
                        ))}
                    </ul>
                </div>
                <Link to="/enroll" className="btn btn-primary">Enroll Now</Link>
            </div>
        </div>
    );
}
