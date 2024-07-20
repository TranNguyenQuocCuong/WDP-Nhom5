import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './TakeAttendance.css';

export default function TakeAttendance() {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [attendanceDate, setAttendanceDate] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Define status options
    const statusOptions = ['Present', 'Absent', 'Late', 'Excused'];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('User not authenticated');
                }
                const [coursesResponse, studentsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/courses/my-courses', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/coaches/my-student', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                setCourses(coursesResponse.data);
                setStudents(studentsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAttendance = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated');
            }

            if (timeStart >= timeEnd) {
                alert('Start time must be sooner than end time');
                return;
            }

            const [timeStartHour, timeStartMinute] = timeStart.split(':');
            const [timeEndHour, timeEndMinute] = timeEnd.split(':');

            const attendanceData = {
                userId: selectedUser,
                courseId: selectedCourse,
                date: attendanceDate,
                timeStartHour: timeStartHour,
                timeStartMinute: timeStartMinute,
                timeEndHour: timeEndHour,
                timeEndMinute: timeEndMinute,
                status: attendanceStatus,
            };

            await axios.post('http://localhost:5000/api/attendance', attendanceData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Attendance recorded successfully');
            // Reset form fields
            setSelectedUser('');
            setSelectedCourse('');
            setAttendanceDate('');
            setTimeStart('');
            setTimeEnd('');
            setAttendanceStatus('');
        } catch (error) {
            console.error('Error recording attendance:', error);
            alert('Error recording attendance: ' + (error.response?.data?.message || error.message));
        }
    };

    const setPresetTimes = () => {
        setTimeStart('13:00');
        setTimeEnd('15:00');
    };
    const setPresetTimes2 = () => {
        setTimeStart('15:00');
        setTimeEnd('18:00');
    };
    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="take-attendance">
            <h2>Take Attendance</h2>
            <form onSubmit={handleAttendance}>
                <select 
                    value={selectedCourse} 
                    onChange={(e) => setSelectedCourse(e.target.value)} 
                    required
                >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.name}</option>
                    ))}
                </select>
                <select 
                    value={selectedUser} 
                    onChange={(e) => setSelectedUser(e.target.value)} 
                    required
                >
                    <option value="">Select Student</option>
                    {students.map(user => (
                        <option key={user._id} value={user._id}>{user.username}</option>
                    ))}
                </select>
                <input 
                    type="date" 
                    value={attendanceDate} 
                    onChange={(e) => setAttendanceDate(e.target.value)} 
                    required 
                />
                <input
                    type="time"
                    value={timeStart} 
                    onChange={(e) => setTimeStart(e.target.value)} 
                    required 
                />
                <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)} 
                    required 
                />
                <select 
                    value={attendanceStatus} 
                    onChange={(e) => setAttendanceStatus(e.target.value)} 
                    required
                >
                    <option value="">Select Status</option>
                    {statusOptions.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>
                <button type="button" onClick={setPresetTimes}>Set to 13:00 - 15:00</button>
                <button type="button" onClick={setPresetTimes2}>Set to 15:00 - 18:00</button>
                <button type="submit">Record Attendance</button>
            </form>
        </div>
    );
}