import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

function ChangePassword() {
  const { id, token } = useParams();
//   const history = useHistory();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5000/api/users/changepassword/${id}/${token}`, { password });
      setMessage(response.data.Status);
      if (response.data.Status === 'Success') {
        window.location.href = '/login';
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
