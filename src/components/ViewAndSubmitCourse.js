// ViewAndSubmitCourse.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAndSubmitCourse.css';

export default function ViewAndSubmitCourse() {
    const [courses, setCourses] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [newWorkoutName, setNewWorkoutName] = useState('');
    const [newWorkoutDescription, setNewWorkoutDescription] = useState('');
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('User not authenticated');
                }
                const coursesResponse = await axios.get('http://localhost:5000/api/courses/my-courses', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const coursesWithData = await Promise.all(
                    coursesResponse.data.map(async course => {
                        const workoutsResponse = await axios.get(`http://localhost:5000/api/courses/${course._id}/workouts`);
                        const courseWithWorkouts = {
                            ...course,
                            workouts: workoutsResponse.data
                        };
                        return courseWithWorkouts;
                    })
                );
                setCourses(coursesWithData);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage
            if (!token) {
                throw new Error('User not authenticated');
            }

            // Create a new workout
            const workoutResponse = await axios.post('http://localhost:5000/api/workouts', {
                name: newWorkoutName,
                description: newWorkoutDescription
            });
            const newWorkoutId = workoutResponse.data._id;

            // Create a new course with workouts
            const newCourse = {
                name: courseName,
                description: courseDescription,
                workouts: [newWorkoutId], // Assuming a single workout for simplicity
            };

            await axios.post('http://localhost:5000/api/courses', newCourse, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            

            alert('Course submitted successfully');
            setCourseName('');
            setCourseDescription('');
            setNewWorkoutName('');
            setNewWorkoutDescription('');
            setSelectedWorkouts([]);
        } catch (error) {
            let errorMessage = 'Error submitting course: ';
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage += error.response.data.error;
            } else {
                errorMessage += error.message;
            }
            alert(errorMessage);
        }
    };

    return (
        <div className="view-submit-course">
            <h2>View and Submit Course</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Course Description"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    required
                ></textarea>
                <h3>Create New Workout</h3>
                <input
                    type="text"
                    placeholder="Workout Name"
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                />
                <textarea
                    placeholder="Workout Description"
                    value={newWorkoutDescription}
                    onChange={(e) => setNewWorkoutDescription(e.target.value)}
                ></textarea>
                <button type="submit">Submit Course</button>
            </form>
            <h3>Existing Courses</h3>
            <table>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Course Description</th>
                        <th>Workouts</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course._id}>
                            <td>{course.name}</td>
                            <td>{course.description}</td>
                            <td>
                                <ul>
                                    {course.workouts.map(workout => (
                                        <li key={workout._id}>{workout.name} - {workout.description}</li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
