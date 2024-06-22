import React from 'react';
import './Popup.css';

const Popup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h2>Detail</h2>
                <p>This is the detailed information in the popup.</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Popup;
