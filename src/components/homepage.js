import React from 'react';
import './HomePage.css';

const HomePage = () => {
    return (
        <div>
            <h2>Welcome to My App</h2>
            <video width="600" controls>
                <source src="/videos/intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default HomePage;
