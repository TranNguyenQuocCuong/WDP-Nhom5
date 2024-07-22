// MainLayout.js
import React from 'react';
import Navbar from './navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => (
    <div>
        <Navbar />
        {children}
        <Footer />
    </div>
);

export default MainLayout;

