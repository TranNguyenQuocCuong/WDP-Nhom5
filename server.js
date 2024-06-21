const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/users');
const AdviceRoute = require('./routes/advice');

const userRoutes = require('./routes/web');
const { authenticateToken } = require('./middlewares/authen');
const { changePassword, getUserProfile } = require('./controllers/userController');
const passport = require('./passport');

require('dotenv').config();

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
  credentials: true
}));

const connectToDatabase = require('./config/mongodb');

mongoose.connect('mongodb://127.0.0.1:27017/gym', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses'); // Thêm route courses
const forgotpasswordRoutes = require('./routes/forgotpassword');
const adviceRoutes = require('./routes/advice');
const coachRoutes = require('./routes/coaches');
const adminRouter = require('./routes/adminRouter');
const reportRouter = require('./routes/reportRouter');


app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes); // Sử dụng route courses
app.use('/forgotpassword', forgotpasswordRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/reports', reportRouter);
app.use('/api/admins', adminRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(passport.initialize());
app.use('/api/users', userRoutes);

// Reset password route
app.post('/resetpassword/:id/:token', (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  console.log('ID:', id);
  console.log('Token:', token);
  console.log('Password:', password);
  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    } else {
      User.findByIdAndUpdate({ _id: id }, { password: password })
        .then(u => res.send({ Status: "Success" }))
        .catch(err => res.send({ Status: err }));
    }
  })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
