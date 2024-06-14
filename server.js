const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/users');
const AdviceRoute = require('./routes/advice');


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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


// Reset password route
app.post('/resetpassword/:id/:token', (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  // Here should be your logic for resetting the password
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
