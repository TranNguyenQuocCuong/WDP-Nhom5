import React from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import ViewAndSubmitCourse from './ViewAndSubmitCourse';
import TakeAttendance from './TakeAttendance';
import TrackUserProgress from './TrackUserProgress';
import GiveAdvice from './GiveAdvice';
import EditProfile from './EditProfile';
import './CoachDashboard.css';

export default function CoachDashboard() {
    return (
        <Router>
            <div className="coach-dashboard">
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <h2>Coach Dashboard</h2>
                    </div>
                    <ul className="sidebar-menu">
                        <li>
                            <NavLink to="/view-submit-course" activeClassName="active">
                                <i className="fas fa-book"></i> View and Submit Course
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/take-attendance" activeClassName="active">
                                <i className="fas fa-clipboard-check"></i> Take Attendance
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/track-progress" activeClassName="active">
                                <i className="fas fa-chart-line"></i> Track User's Progress
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/give-advice" activeClassName="active">
                                <i className="fas fa-comments"></i> Give Advice
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/edit-profile" activeClassName="active">
                                <i className="fas fa-user-edit"></i> Edit Profile
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <main className="content">
                    <Switch>
                        <Route path="/view-submit-course" component={ViewAndSubmitCourse} />
                        <Route path="/take-attendance" component={TakeAttendance} />
                        <Route path="/track-progress" component={TrackUserProgress} />
                        <Route path="/give-advice" component={GiveAdvice} />
                        <Route path="/edit-profile" component={EditProfile} />
                    </Switch>
                </main>
            </div>
        </Router>
    );
}