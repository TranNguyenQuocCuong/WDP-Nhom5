const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/users');
const AdviceRoute = require('./routes/advice');


const app = express();

// Middleware
app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000', 'http://example2.com'];
app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is allowed or not
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow credentials
}));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/gym', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses'); // Thêm route courses
// const forgotpasswordRoutes = require('./routes/forgotpassword');
const adviceRoutes = require('./routes/advice');
const coachRoutes = require('./routes/coaches');
const adminRouter = require('./routes/adminRouter');
const reportRouter = require('./routes/reportRouter');
const paymentRoutes = require('./routes/payment');
const attendanceRoutes = require('./routes/attendance');
const workoutRoutes = require('./routes/workouts');

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes); // Sử dụng route courses
// app.use('/forgotpassword', forgotpasswordRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/reports', reportRouter);
app.use('/api/admins', adminRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/workouts', workoutRoutes);

// Reset password route
app.post('/resetpassword/:id/:token', (req, res) => {
  const { id, token } = req.params
  const { password } = req.body

  console.log('ID:', id);
  console.log('Token:', token);
  console.log('Password:', password);
  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" })
    } else {
      bcrypt.hash(password, 10)
        .then(hash => {
          User.findByIdAndUpdate({ _id: id }, { password: password })
            .then(u => res.send({ Status: "Success" }))
            .catch(err => res.send({ Status: err }))
        })
        .catch(err => res.send({ Status: err }))
    }
  })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
