const express = require('express');
const router = express.Router();
const passport = require('../passport');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authen');
const { userprofile, getHomePage, register, login, logout, getUserProfile, editProfile, changePassword, forgotPassword } = require('../controllers/userController');

router.get('/', getHomePage);

router.post('/register', register);

router.post('/login', login);

router.post('/logout', authenticateToken, logout);

// router.get('/userProfile', authenticateToken, getUserProfile);

router.put('/edit-profile', authenticateToken, editProfile);

router.put('/change-password', authenticateToken, changePassword);

router.post('/forgotpassword', forgotPassword);

router.get('/userprofile', authenticateToken, userprofile);

router.get('/facebook/token', passport.authenticate('facebook-token'), userController.facebookLogin);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), userController.googleLogin);

module.exports = router;
