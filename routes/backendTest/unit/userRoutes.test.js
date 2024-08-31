if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
    global.TextDecoder = require('util').TextDecoder;
}

const express = require('express');
const request = require('supertest');
const router = require('../../../routes/web');
const User = require('../../../models/users');

jest.mock('../../../models/users');

const app = express();
app.use(express.json());
app.use('/api/users', router);

describe('POST /api/users/register', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should register a new user successfully', async () => {
        const userData = {
            username: 'testuser',
            password: 'password123',
            email: 'test@example.com'
        };

        // Mock Mongoose methods
        User.findOne = jest.fn().mockResolvedValue(null); // No existing user
        User.prototype.save = jest.fn().mockResolvedValue(userData); // Save successful

        const response = await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(201);

        expect(response.body).toEqual({ msg: 'Registration successful' });
    });

    it('should return 400 if username already exists', async () => {
        const userData = {
            username: 'testuser',
            password: 'password123',
            email: 'test@example.com'
        };

        // Mock Mongoose methods
        User.findOne = jest.fn()
        .mockImplementation(({ username }) => {
            if (username === 'testuser') {
                return Promise.resolve({ username: 'testuser' }); // Simulate existing username
            }
            return Promise.resolve(null);
        });

        const response = await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(400);

        expect(response.body).toEqual({ msg: 'Username already exists' });
    });

    it('should return 400 if email already exists', async () => {
        const userData = {
            username: 'newuser',
            password: 'password123',
            email: 'existingemail@example.com'
        };

        // Mock Mongoose methods
        User.findOne = jest.fn()
            .mockImplementation(({ email }) => {
                if (email === 'existingemail@example.com') {
                    return Promise.resolve({ email: 'existingemail@example.com' });
                }
                return Promise.resolve(null);
            });

        const response = await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(400);

        expect(response.body).toEqual({ msg: 'Email already exists' });
    });

    it('should return 500 for server error', async () => {
        const userData = {
            username: 'user',
            password: 'password123',
            email: 'user@example.com'
        };

        // Mock Mongoose methods to throw an error
        User.findOne = jest.fn().mockRejectedValue(new Error('Server error'));

        const response = await request(app)
            .post('/api/users/register')
            .send(userData)
            .expect(500);

        expect(response.text).toBe('Server error');
    });
});
