import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import './UserSchedule.css'; // Import CSS file for styling

const UserSchedule = () => {
    const [profile, setProfile] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null); // State to store the selected date for the popup

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/userProfile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(response.data);

                await fetchSchedule(response.data._id);
            } catch (error) {
                console.error('Error fetching profile information:', error);
                setLoading(false);
            }
        };

        const fetchSchedule = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/getUserWorkoutSchedule?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // Sort the schedule by date in ascending order
                const sortedSchedule = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setSchedule(sortedSchedule);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const closePopup = () => {
        setSelectedDate(null);
    };

    const toggleCompletionStatus = async () => {
        if (!moment(selectedDate).isSame(moment(), 'day')) {
            alert('You can only toggle the completion status for today\'s workouts.');
            return;
        }

        try {
            const selectedSchedule = schedule.find(sch => moment(sch.date).isSame(selectedDate, 'day'));
            const newStatus = !selectedSchedule.status;

            await axios.put('http://localhost:5000/updateWorkoutStatus', {
                userId: profile._id,
                date: selectedDate,
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update the local state to reflect the change
            setSchedule(schedule.map(sch => {
                if (moment(sch.date).isSame(selectedDate, 'day')) {
                    return { ...sch, status: newStatus };
                }
                return sch;
            }));
            closePopup(); // Close the popup after toggling the status
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-schedule">
            <table className="schedule-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Workout</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((sch) => (
                        <tr
                            key={sch.date}
                            className={`
                                ${moment(sch.date).isSame(moment(), 'day') ? 'today' : ''} 
                                ${sch.status ? 'completed' : ''}
                            `}
                        >
                            <td>{moment(sch.date).format('YYYY-MM-DD')}</td>
                            <td>
                                <ul>
                                    {sch.workouts.map((workout, index) => (
                                        <li key={`${sch.date}-${index}`} onClick={() => handleDateClick(sch.date)} className="workout-item">
                                            {workout.name}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedDate && (
                <div className="workout-popup">
                    <div className="workout-popup-content">
                        <span className="workout-popup-close" onClick={closePopup}>&times;</span>
                        <h2>Workout {new Date(selectedDate).toLocaleDateString()}</h2>
                        <hr className='hr1'></hr>
                        <ul>
                            {schedule
                                .find((sch) => moment(sch.date).isSame(selectedDate, 'day'))
                                .workouts.map((workout, index) => (
                                    <li key={`${selectedDate}-${index}`}>
                                        <h3>{workout.name}</h3>
                                        <p>
                                            {workout.video && (
                                                <iframe
                                                    width="640px"
                                                    height="400px"
                                                    src={`https://www.youtube.com/embed/${workout.video}`}
                                                    frameBorder="0"
                                                    allowFullScreen
                                                />
                                            )}
                                        </p>
                                        <p>{workout.description}</p>
                                        <hr></hr>
                                    </li>
                                ))}
                        </ul>
                        <button className="mark-complete-button" onClick={toggleCompletionStatus}>
                            {schedule.find(sch => moment(sch.date).isSame(selectedDate, 'day')).status ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSchedule;
