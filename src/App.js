import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
            </Routes>
        </Router>
    );
};

export default App;
