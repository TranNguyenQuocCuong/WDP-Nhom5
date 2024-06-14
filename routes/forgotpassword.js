const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.send({ Status: "User not existed" })
        }
        const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" })
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
                return res.send({ Status: "Success" })
            }
        });
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;