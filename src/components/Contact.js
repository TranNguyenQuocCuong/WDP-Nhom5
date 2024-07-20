import React, { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [type, setType] = useState('');
  const [data, setData] = useState('');

  const mapStyle = {
    border: '0px',
    height: '550px',
    width: '-webkit-fill-available'
  };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (!type || !data) {
          throw new Error('Missing required fields');
        }
  
        const token = localStorage.getItem('token'); // Get the token from local storage
        if (!token) {
          throw new Error('User not authenticated');
        }
  
        const reportData = { type, data };
        const response = await axios.post('http://localhost:5000/api/reports', reportData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        alert('Report submitted successfully');
        setType('');
        setData('');
      } catch (error) {
        let errorMessage = 'Error submitting report: ';
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage += error.response.data.error;
        } else {
          errorMessage += error.message;
        }
        alert(errorMessage);
      }
    };

  return (
    <div id="contact" className='container'>
      <div className="row">
        <div className="col-md-6 mb-md-0 mb-5">
          <div>
            <h4>CONTACT US</h4>
            <h2 className='display-5 mb-4'>GET IN TOUCH</h2>
          </div>
          <div className='contact-info d-flex flex-column'>
            <div className='d-flex align-items-center mb-3'>
              <div className='bg-primary rounded-circle d-flex align-items-center justify-content-center me-3'>
                <i className="fa fa-map-marker-alt"></i>
              </div>
              <div>
                <p className='m-0'>123 Street, New York, USA</p>
              </div>
            </div>

            <div className='d-flex align-items-center mb-3'>
              <div className='bg-primary rounded-circle d-flex align-items-center justify-content-center me-3'>
                <i className="fa fa-phone"></i>
              </div>
              <div>
                <p className='m-0'>+012 345 6789</p>
              </div>
            </div>

            <div className='d-flex align-items-center'>
              <div className='bg-primary rounded-circle d-flex align-items-center justify-content-center me-3'>
                <i className="fa fa-envelope"></i>
              </div>
              <div>
                <p className='m-0'>info@example.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 mt-3">
              <select className="form-control rounded-0" name="type" value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">Select type</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="mb-3">
              <textarea className="form-control rounded-0" rows="5" name="data" placeholder="Data" value={data} onChange={(e) => setData(e.target.value)} required></textarea>
            </div>
            <div className='d-grid'>
              <button type="submit" className="btn btn-block rounded-0">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57905.56571393285!2d67.11334533125!3d24.894643500000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb339dd644b99db%3A0x1dcfc823fd54e7d5!2sFit%20Fusion%20-%20Gym!5e0!3m2!1sen!2s!4v1705432080225!5m2!1sen!2s" style={mapStyle} allowFullScreen="" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  );
}
