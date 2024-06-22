const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const nodemailer = require('nodemailer');
const SECRET_KEY = process.env.SECRET_KEY;
const { authenticateToken } = require('../middlewares/authen');

const getHomePage = (req, res) => {
  return res.render('HomePage.js');
};

const register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    user = new User({
      username,
      password,
      email,
    });

    await user.save();
    res.status(201).json({ msg: 'Registration successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('--------------LOGIN CHECK---------------\n');
  console.log('>>> username, password: ', username, ' --- ', password);

  try {
    const user = await User.findOne({ username });
    console.log('>>> user: ', user);
    if (!user) {
      console.log('Username is incorrect');
      return res.status(400).json({ msg: 'Username is incorrect' });
    }

    // So sánh mật khẩu
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = await User.findOne({ password });
    if (!isMatch) {
      console.log('Password is incorrect');
      return res.status(400).json({ msg: 'Password is incorrect' });
    }
    console.log("LOGIN SUCCESSFULLY");
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
    console.log('>>> SECRET_KEY: ', process.env.SECRET_KEY);
    console.log('>>> token: ', token);
    return res.status(200).json({ msg: 'Login success', token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

const facebookLogin = (req, res) => {
  if (req.user) {
    const token = jwt.sign({ id: req.user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({
      success: true,
      token: token,
      status: 'You are successfully logged in!',
    });
  } else {
    res.status(401).json({
      success: false,
      status: 'Failed to log in with Facebook',
    });
  }
};

const googleLogin = (req, res) => {
  if (req.user) {
    const token = jwt.sign({ id: req.user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({
      success: true,
      token: token,
      status: 'You are successfully logged in!',
    });
  } else {
    res.status(401).json({ msg: 'Authentication failed' });
  }
};

// Route để lấy thông tin người dùng đã đăng nhập
const userprofile = async (req, res) => {
  try {
    // Lấy thông tin người dùng từ middleware authenticateToken đã xác thực
    const user = await User.findById(req.user.id).select('-password');
    console.log('>>> user1111: ', user);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const logout = (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  validTokens.delete(token);
  console.log('>>> token after delete: ', token)
  res.json({ msg: 'Logout successful' });
};

const getUserProfile = async (req, res) => {
  const username = req.user.username;
  console.log('>>> username = ', username);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const editProfile = async (req, res) => {
  const { userId, name, email, gender } = req.body;

  try {
    const user = await User.findOne({ username: "User1" });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    user.name = name;
    user.email = email;
    user.gender = gender;

    await user.save();
    res.status(200).json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ username: "User1" });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ msg: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.send({ Status: "User not existed" });
    }
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'phandinhdan6666@gmail.com',
        pass: 'nxum kgxi agdf rnvi'
      }
    });

    var mailOptions = {
      from: 'phandinhdan6666@gmail.com',
      to: email,
      subject: 'Reset Password Link',
      text: `http://localhost:3000/resetpassword/${user._id}/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getHomePage,
  register,
  login,
  getUserProfile,
  editProfile,
  changePassword,
  logout,
  forgotPassword,
  userprofile,
  facebookLogin,
  googleLogin
};
