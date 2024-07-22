import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAndSubmitCourse.css';

export default function ViewAndSubmitCourse() {
    const [courses, setCourses] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseTime, setCourseTime] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [courseAction, setCourseAction] = useState(false);
    const [newWorkouts, setNewWorkouts] = useState([{ name: '', description: '', video: '' }]);
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
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
                    return {
                        ...course,
                        workouts: workoutsResponse.data
                    };
                })
            );
            setCourses(coursesWithData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleWorkoutChange = (index, field, value) => {
        const updatedWorkouts = [...newWorkouts];
        updatedWorkouts[index][field] = value;
        setNewWorkouts(updatedWorkouts);
    };

    const addNewWorkout = () => {
        setNewWorkouts([...newWorkouts, { name: '', description: '', video: '' }]);
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setCourseName(course.name);
        setCourseDescription(course.description);
        setCourseTime(course.time);
        setCoursePrice(course.price);
        setCourseAction(course.action);
        setNewWorkouts(course.workouts.map(w => ({ ...w })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated');
            }

            const courseData = {
                name: courseName,
                description: courseDescription,
                time: courseTime,
                price: coursePrice,
                action: courseAction,
            };

            let response;
            if (editingCourse) {
                // Update existing course
                response = await axios.put(`http://localhost:5000/api/courses/${editingCourse._id}`, courseData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Update or create workouts
                for (const workout of newWorkouts) {
                    if (workout._id) {
                        await axios.put(`http://localhost:5000/api/workouts/${workout._id}`, workout);
                    } else {
                        const newWorkoutResponse = await axios.post('http://localhost:5000/api/workouts', workout);
                        await axios.post(`http://localhost:5000/api/courses/${editingCourse._id}/workouts`, { workoutId: newWorkoutResponse.data._id });
                    }
                }
            } else {
                // Create new course
                response = await axios.post('http://localhost:5000/api/courses', courseData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Create workouts and associate with the new course
                for (const workout of newWorkouts) {
                    const newWorkoutResponse = await axios.post('http://localhost:5000/api/workouts', workout);
                    await axios.post(`http://localhost:5000/api/courses/${response.data._id}/workouts`, { workoutId: newWorkoutResponse.data._id });
                }
            }

            alert(editingCourse ? 'Course updated successfully' : 'Course submitted successfully');
            resetForm();
            fetchCourses();
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

    const resetForm = () => {
        setCourseName('');
        setCourseDescription('');
        setCourseTime('');
        setCoursePrice('');
        setCourseAction(false);
        setNewWorkouts([{ name: '', description: '', video: '' }]);
        setEditingCourse(null);
    };

    return (
        <div className="view-submit-course">
            <h2>{editingCourse ? 'Edit Course' : 'Submit New Course'}</h2>
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
                <input
                    type="number"
                    placeholder="Course Time (in days)"
                    value={courseTime}
                    onChange={(e) => setCourseTime(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Course Price"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                />
                <label>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="courseAction"
                            className="action-checkbox"
                            checked={courseAction}
                            onChange={(e) => setCourseAction(e.target.checked)}
                        />
                        <label htmlFor="courseAction">Action</label>
                    </div>
                </label>
                <div className="workout-section">
                    <h3>Workouts</h3>
                    {newWorkouts.map((workout, index) => (
                        <div key={index} className="workout-item">
                            <h4>Workout {index + 1}</h4>
                            <input
                                type="text"
                                placeholder="Workout Name"
                                value={workout.name}
                                onChange={(e) => handleWorkoutChange(index, 'name', e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Workout Description"
                                value={workout.description}
                                onChange={(e) => handleWorkoutChange(index, 'description', e.target.value)}
                                required
                            ></textarea>
                            <input
                                type="text"
                                placeholder="Workout Video URL"
                                value={workout.video}
                                onChange={(e) => handleWorkoutChange(index, 'video', e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <button type="button" className="add-workout-btn" onClick={addNewWorkout}>Add Another Workout</button>
                </div>
                <button type="submit">{editingCourse ? 'Update Course' : 'Submit Course'}</button>
            </form>
            <h3>Existing Courses</h3>
            <table>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Course Description</th>
                        <th>Course Time</th>
                        <th>Course Price</th>
                        <th>Course Action</th>
                        <th>Workouts</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course._id}>
                            <td>{course.name}</td>
                            <td>{course.description}</td>
                            <td>{course.time}</td>
                            <td>{course.price}</td>
                            <td>{course.action ? 'Yes' : 'No'}</td>
                            <td>
                                <ul>
                                    {course.workouts.map(workout => (
                                        <li key={workout._id}>
                                            {workout.name} - {workout.description}
                                            <br />
                                            <a href={workout.video} target="_blank" rel="noopener noreferrer">Video</a>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEditCourse(course)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}