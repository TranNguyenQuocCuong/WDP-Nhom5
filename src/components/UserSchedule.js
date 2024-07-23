import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import './UserSchedule.css'; // Import CSS file for styling

const UserSchedule = () => {
    const [profile, setProfile] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(moment());
    const [startDate, setStartDate] = useState(moment().startOf('week')); // Start of the week
    const [endDate, setEndDate] = useState(moment().endOf('week')); // End of the week
    const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
    const [allWorkoutsCompleted, setAllWorkoutsCompleted] = useState(false);

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

    useEffect(() => {
        // Update completion status for the selected date
        const workouts = getWorkoutsForDate(currentDate);
        if (workouts.length > 0) {
            const allCompleted = workouts.every(workout => workout.status);
            setAllWorkoutsCompleted(allCompleted);
        }
    }, [currentDate, schedule]);

    const handleDateNavigation = (direction) => {
        const newStartDate = direction === 'left' ? startDate.subtract(1, 'week') : startDate.add(1, 'week');
        const newEndDate = direction === 'left' ? endDate.subtract(1, 'week') : endDate.add(1, 'week');

        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setCurrentDate(prevDate => {
            if (moment(prevDate).isBetween(newStartDate, newEndDate, null, '[]')) {
                return prevDate;
            }
            return direction === 'left' ? newStartDate.clone().add(3, 'days') : newEndDate.clone().add(-3, 'days');
        });
    };

    const getDatesInRange = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(startDate.clone().add(i, 'days'));
        }
        return dates;
    };

    const getWorkoutsForDate = (date) => {
        const workoutSchedule = schedule.find(sch => moment(sch.date).isSame(date, 'day'));
        return workoutSchedule ? workoutSchedule.workouts : [];
    };

    const handleWorkoutNavigation = (direction) => {
        const workouts = getWorkoutsForDate(currentDate);
        if (workouts.length === 0) return;

        if (direction === 'next') {
            setCurrentWorkoutIndex((prevIndex) => (prevIndex + 1) % workouts.length);
        } else {
            setCurrentWorkoutIndex((prevIndex) => (prevIndex - 1 + workouts.length) % workouts.length);
        }
    };

    const toggleCompletionStatus = async () => {
        if (!moment(currentDate).isSame(moment(), 'day')) {
            alert('You can only toggle the completion status for today\'s workouts.');
            return;
        }

        try {
            const selectedSchedule = schedule.find(sch => moment(sch.date).isSame(currentDate, 'day'));
            if (!selectedSchedule) {
                alert('No schedule found for the selected date.');
                return;
            }

            const newStatus = !allWorkoutsCompleted;

            await axios.put('http://localhost:5000/updateWorkoutStatus', {
                userId: profile._id,
                date: selectedSchedule.date,
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSchedule(schedule.map(sch => {
                if (moment(sch.date).isSame(currentDate, 'day')) {
                    return {
                        ...sch,
                        workouts: sch.workouts.map(workout => ({
                            ...workout,
                            status: newStatus
                        }))
                    };
                }
                return sch;
            }));
            setAllWorkoutsCompleted(newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    const datesInRange = getDatesInRange();
    const workouts = getWorkoutsForDate(currentDate);
    const currentWorkout = workouts[currentWorkoutIndex];

    return (
        <div className="user-schedule">
            <div className="date-navigation">
                <button className="nav-button" onClick={() => handleDateNavigation('left')}>&lt;</button>
                <div className="date-tabs">
                    {datesInRange.map((date) => (
                        <button
                            key={date.format('YYYY-MM-DD')}
                            className={`date-tab ${moment(date).isSame(currentDate, 'day') ? 'active' : ''}`}
                            onClick={() => {
                                setCurrentDate(date);
                                setCurrentWorkoutIndex(0); // Reset index when changing date
                            }}
                        >
                            {date.format('DD/MM')} {/* Changed format here */}
                        </button>
                    ))}
                </div>
                <button className="nav-button" onClick={() => handleDateNavigation('right')}>&gt;</button>
            </div>
            <div className="workouts-display">
                <h2>Workouts for {moment(currentDate).format('DD MMM YYYY')}</h2>
                {workouts.length > 0 ? (
                    <div className="video-container">
                        {currentWorkout.video && (
                            <iframe
                                src={`https://www.youtube.com/embed/${currentWorkout.video}`}
                                frameBorder="0"
                                allowFullScreen
                                title={currentWorkout.name}
                            />
                        )}
                    </div>

                ) : (
                    <div className="no-schedule">You don't have a workout schedule today</div>
                )}
            </div>

            <div className="workout-navigation">
                <div className="workout-controls">
                    <button onClick={() => handleWorkoutNavigation('previous')}>&lt;</button>
                    <span>{currentWorkoutIndex + 1} / {workouts.length}</span>
                    <button onClick={() => handleWorkoutNavigation('next')}>&gt;</button>
                </div>
                <button
                    className={`mark-complete-button ${allWorkoutsCompleted ? 'completed' : 'incomplete'}`}
                    onClick={toggleCompletionStatus}
                >
                    {allWorkoutsCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
            </div>
        </div>
    );
};

export default UserSchedule;
