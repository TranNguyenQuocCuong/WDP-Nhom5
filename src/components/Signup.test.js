
import { render, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock the alert function
global.alert = jest.fn();

jest.mock('axios');

describe('Signup Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('submits the form with user input successfully', async () => {
    axios.post.mockResolvedValue({ data: { msg: 'Registration successful' } });

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });

    fireEvent.click(getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/register',
        { username: 'testuser', password: 'password123', email: 'test@example.com' }
      );
    });

    expect(global.alert).toHaveBeenCalledWith('Registration successful');
  });

  it('displays an error message for existing username', async () => {
    axios.post.mockRejectedValue({ response: { data: { msg: 'Username already exists' } } });

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'existinguser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'newemail@example.com' } });

    fireEvent.click(getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/register',
        { username: 'existinguser', password: 'password123', email: 'newemail@example.com' }
      );
    });

    expect(global.alert).toHaveBeenCalledWith('Error signing up: Username already exists');
  });

  it('displays an error message for existing email', async () => {
    axios.post.mockRejectedValue({ response: { data: { msg: 'Email already exists' } } });

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'existingemail@example.com' } });

    fireEvent.click(getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/register',
        { username: 'newuser', password: 'password123', email: 'existingemail@example.com' }
      );
    });

    expect(global.alert).toHaveBeenCalledWith('Error signing up: Email already exists');
  });

  it('displays a server error message', async () => {
    axios.post.mockRejectedValue({ response: { data: { msg: 'Server error' } } });

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'user' } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'user@example.com' } });

    fireEvent.click(getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/register',
        { username: 'user', password: 'password123', email: 'user@example.com' }
      );
    });

    expect(global.alert).toHaveBeenCalledWith('Error signing up: Server error');
  });
});


