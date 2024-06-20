const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/users');
const userRoutes = require('./routes/web');
const { authenticateToken } = require('./middlewares/authen');
const { changePassword, getUserProfile } = require('./controllers/userController');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000', 'http://example2.com'];
app.use(cors({
  origin: function (origin, callback) {
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

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/users', userRoutes);

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
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
