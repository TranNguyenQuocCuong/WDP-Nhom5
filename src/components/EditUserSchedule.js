import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './EditUserSchedule.css';

const EditUserSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState({});
    const [eventList, setEventList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentMonth, setCurrentMonth] = useState(moment().month());
    const [currentYear, setCurrentYear] = useState(moment().year());
    const [alertMessage, setAlertMessage] = useState({ message: "", type: "" });

    useEffect(() => {
        fetchEvents();
        fetchSchedules();
    }, []);

    useEffect(() => {
        generateCalendar(currentMonth, currentYear);
    }, [events, currentMonth, currentYear, schedules]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/workouts');
            const data = response.data;
            setEventList(data); // Assuming data contains workout objects with 'name' and '_id'
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchSchedules = async () => {
        try {
            const userProfileResponse = await axios.get('http://localhost:5000/api/users/userProfile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const userId = userProfileResponse.data._id;
            // Lấy userId từ localStorage (hoặc nơi bạn lưu trữ token và thông tin người dùng)
            console.log('>>> userId fetchSchedules: ', userId);

            // Gọi API với userId
            const response = await axios.get(`http://localhost:5000/getScheduleWithWorkouts/${userId}`);
            const data = response.data;
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const generateCalendar = (month, year) => {
        const firstDay = moment([year, month]).startOf('month').day();
        const daysInMonth = moment([year, month]).daysInMonth();
        const today = moment();
        const calendar = [];

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push(<td key={j} className="calendar-cell"></td>);
                } else if (date > daysInMonth) {
                    week.push(<td key={j} className="calendar-cell"></td>);
                } else {
                    const cellDate = moment([year, month, date]);
                    const filteredSchedules = schedules.filter(schedule =>
                        moment(schedule.dailyWorkouts[0].date).isSame(cellDate, 'day')
                    );

                    const isCompleted = filteredSchedules.some(schedule => schedule.dailyWorkouts.some(workout => workout.status === true));

                    week.push(
                        <td key={j} className={`calendar-cell ${cellDate.isBefore(today, 'day') ? 'past' : cellDate.isSame(today, 'day') ? 'today' : ''} ${isCompleted ? 'completed' : ''}`}>
                            <strong>{date}</strong>
                            {filteredSchedules.length > 0 && (
                                <div>
                                    {filteredSchedules.map((schedule, index) => (
                                        <div key={index}>
                                            {schedule.dailyWorkouts[0].workouts.map((workout, index) => (
                                                <div key={index}>
                                                    {workout}
                                                    <i className="fa fa-times remove-icon" onClick={() => removeWorkout(schedule._id)}></i>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </td>
                    );
                    date++;
                }
            }
            calendar.push(<tr key={i}>{week}</tr>);
        }
        return calendar;
    };

    const generateDayEvents = (date) => {
        return schedules[date] ? schedules[date].map((event, index) => (
            `<div key=${index}>${event} <button class="btn btn-sm btn-danger remove-event" data-date="${date}" data-event="${event}">&times;</button></div>`
        )).join("") : "";
    };

    const addEvent = async (date, workoutIds) => {
        const eventDate = moment(date);
        const today = moment();
        if (eventDate.isBefore(today, 'day')) {
            showAlert("Cannot add workouts to past dates.", "alert-danger");
            return;
        }

        try {
            // Fetch user profile to get user ID
            const userProfileResponse = await axios.get('http://localhost:5000/api/users/userProfile', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const userId = userProfileResponse.data._id;

            // Prepare the request body
            const requestBody = {
                userId, // Replace with actual user id
                coachId: '8856c686a0d344983634820e', // Replace with actual coach id
                date,
                workoutIds,
                status: false // You can set a default status or handle it dynamically
            };

            // Make POST request to update schedule
            await axios.post('http://localhost:5000/update-schedule', requestBody);

            // After successful update, fetch schedules again to update the state
            fetchSchedules(); // This will trigger useEffect to update schedules state

            showAlert("Event successfully added to calendar and schedule updated.", "alert-success");
        } catch (error) {
            console.error('Error adding event to schedule:', error);
            showAlert("Failed to update schedule. Please try again later.", "alert-danger");
        }
    };

    const removeWorkout = async (scheduleId) => {
        console.log('>>> scheduleId: ', scheduleId); // Verify scheduleId is correct
        try {
            // Make DELETE request to remove event from schedule using scheduleId
            await axios.delete(`http://localhost:5000/remove-schedule/${scheduleId}`);

            // Update local state to reflect the removal
            setSchedules(prevSchedules => {
                // Filter out the removed schedule
                const updatedSchedules = prevSchedules.filter(schedule => schedule._id !== scheduleId);
                return updatedSchedules;
            });

            showAlert("Event successfully removed from calendar and schedule updated.", "alert-success");
        } catch (error) {
            console.error('Error removing event from schedule:', error);
            showAlert("Failed to remove event from schedule. Please try again later.", "alert-danger");
        }
    };

    const showAlert = (message, type) => {
        setAlertMessage({ message, type });
        setTimeout(() => setAlertMessage({ message: "", type: "" }), 3000);
    };

    const handleEventClick = (event) => {
        const eventDate = document.getElementById("eventDate").value;
        if (eventDate) {
            addEvent(eventDate, [event._id]); // Assuming event object has _id field
            document.getElementById("eventDate").value = ""; // Clear date input
            setSearchTerm(""); // Clear search input
        } else {
            showAlert("Please select a date.", "alert-danger");
        }
    };

    const handleCellClick = (date) => {
        const eventDateInput = document.getElementById("eventDate");
        eventDateInput.value = date;
    };

    const changeMonth = (direction) => {
        if (direction === "prev") {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        } else if (direction === "next") {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    const filterEventList = () => {
        if (!eventList) return []; // Kiểm tra nếu eventList chưa được khởi tạo

        const filteredEvents = eventList.filter(event => {
            // Kiểm tra nếu event.name tồn tại và không phải là undefined
            return event.name && event.name.toLowerCase().includes(searchTerm.toLowerCase());
        });

        return filteredEvents.map(event => (
            <div key={event._id} className="list-group-item event-item" onClick={() => handleEventClick(event)}>
                {event.name}
            </div>
        ));
    };

    const handleUpdateClick = () => {
        // Logic for handling update click (if needed)
        // This function can be implemented based on your requirements
        // For example, you can trigger some action or update state
        console.log("Update button clicked");
    };

    return (
        <div className="content container">
            <div className="row">
                <div className="col-md-4">
                    <h4>Add Workouts</h4>
                    <div className="form-group">
                        <label htmlFor="eventDate">Select Date:</label>
                        <input type="date" id="eventDate" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="searchEvent">Search Workouts:</label>
                        <input type="text" id="searchEvent" className="form-control search-input" placeholder="Search workouts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div id="event-list" className="event-list list-group">
                        {filterEventList()}
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleUpdateClick}>Update</button>
                </div>
                <div className="col-md-8">
                    <div className="d-flex justify-content-between mb-3">
                        <button className="btn btn-secondary" onClick={() => changeMonth("prev")}>Previous</button>
                        <h5>{moment([currentYear, currentMonth]).format("MMMM YYYY")}</h5>
                        <button className="btn btn-secondary" onClick={() => changeMonth("next")}>Next</button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr className="text-center">
                                    <th scope="col">Sunday</th>
                                    <th scope="col">Monday</th>
                                    <th scope="col">Tuesday</th>
                                    <th scope="col">Wednesday</th>
                                    <th scope="col">Thursday</th>
                                    <th scope="col">Friday</th>
                                    <th scope="col">Saturday</th>
                                </tr>
                            </thead>
                            <tbody id="calendar-body">
                                {generateCalendar(currentMonth, currentYear)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {alertMessage.message && (
                <div id="alertMessage" className={`alert ${alertMessage.type} show`} role="alert">
                    {alertMessage.message}
                </div>
            )}
        </div>
    );
};

export default EditUserSchedule;
