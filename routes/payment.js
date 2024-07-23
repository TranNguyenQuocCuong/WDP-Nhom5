const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { v4: uuidv4 } = require('uuid');
const axios = require("axios");
const { log } = require('console');
const dateFormat = require("dateformat");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const session = require('express-session');
const nodemailer = require('nodemailer');


router.post("/momopayment", async (req, res) => {
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:5000/api/payments/payment-success';
    var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    // var requestType = "captureWallet";
    var requestType = "payWithCC";
    var amount = req.body.coursePrice || 0;
    var orderId = `FitZone-${new Date().getTime()}-${uuidv4()}`;
    var requestId = orderId;
    var extraData = '';
    var autoCapture = true;
    var lang = 'vi';

    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        signature: signature
    };

    const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
        },
        data: requestBody
    };

    try {
        const result = await axios(options);
        const payUrl = result.data.payUrl;
        console.log("--------------------PAY URL----------------")
        console.log('>>> payUrl: ', payUrl);
        res.status(200).json({ payUrl });
    } catch (error) {
        return res.status(500).json({
            STATUS_CODES: 500,
            message: "server error"
        });
    }




    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'phandinhdan6666@gmail.com',
            pass: 'nxum kgxi agdf rnvi'
        }
    });

    /////////////////////////////////////////////////////




    const { coursePrice, name, email, phone, courseId } = req.body;



    /////////////////////////////////////////////////////
    const generateRandomString = () => {
        return Math.random().toString(36).substring(2, 10);
    };


    try {
        // Find user based on email
        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found. Creating a new user.');

            // Generate random username and password
            const username = generateRandomString();
            const password = generateRandomString();

            // Create new user
            user = new User({
                username,
                password,
                email,
                name,
                phone,
                subscribedCourses: [courseId]
            });

            await user.save();
            console.log('New user created successfully');




            var mailOptions = {
                from: 'phandinhdan6666@gmail.com',
                to: email,
                subject: 'Member registration successful',
                html: `
            <h1>Member registration successful</h1>
            <p>Dear ${name},</p>
            <p>Thank you for registering for our course. We are delighted to have you join us!</p>
            <p>Here are the details of your registration:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone Number:</strong> ${phone}</li>
                <li><strong>Course Price:</strong> ${coursePrice} VNĐ</li>
            </ul>
            <p>And your account to login page</p>
            <ul>
                <li><strong>Username:</strong> ${username}</li>
                <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>If you have any questions or need further assistance, please feel free to contact us.</p>
            <p>Best regards,<br>FitZone Team<</p>
        `
            };
        } else {
            // Check if courseId is already in the subscribedCourses array
            if (user.subscribedCourses.includes(courseId)) {
                console.log('Course already subscribed');
                return;
            }

            // Add courseId to subscribedCourses array
            user.subscribedCourses.push(courseId);

            // Save changes to MongoDB
            await user.save();
            console.log('Course added successfully');


            var mailOptions = {
                from: 'phandinhdan6666@gmail.com',
                to: email,
                subject: 'Member registration successful',
                html: `
            <h1>Member registration successful</h1>
            <p>Dear ${name},</p>
            <p>Thank you for registering for our course. We are delighted to have you join us!</p>
            <p>Here are the details of your registration:</p>
            <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone Number:</strong> ${phone}</li>
                <li><strong>Course Price:</strong> ${coursePrice} VNĐ</li>
            </ul>
            <p>If you have any questions or need further assistance, please feel free to contact us.</p>
            <p>Best regards, <br>FitZone Team</p>
        `
            };
        }

    } catch (error) {
        console.error('Error adding course to user:', error);
    }


    // try {
    //     // Tìm người dùng dựa trên email
    //     const user = await User.findOne({ email });

    //     if (!user) {
    //         console.log('User not found');
    //     }

    //     // Kiểm tra xem courseId đã có trong mảng subscribedCourses chưa
    //     if (user.subscribedCourses.includes(courseId)) {
    //         console.log('Course already subscribed');
    //     }

    //     // Thêm courseId vào mảng subscribedCourses
    //     user.subscribedCourses.push(courseId);

    //     // Lưu thay đổi vào MongoDB
    //     await user.save();

    //     // Gửi phản hồi thành công
    //     console.log('Course added successfully');

    // } catch (error) {
    //     console.error('Error adding course to user:', error);
    // }



    /////////////////////////////////////////////////////


    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(500).send({ Status: "Error", Error: error.message });
        } else {
            console.log('Email sent: ' + info.response);
            return res.send({ Status: "Success" });
        }
    });

    // try {
    //     // Tìm người dùng dựa trên userId
    //     const user = await User.findOne({ email });

    //     if (!user) {
    //         return res.status(404).json({ message: 'User not found' });
    //     }

    //     // Kiểm tra xem courseId đã có trong mảng subscribedCourses chưa
    //     if (user.subscribedCourses.includes(courseId)) {
    //         return res.status(400).json({ message: 'Course already subscribed' });
    //     }

    //     // Thêm courseId vào mảng subscribedCourses
    //     user.subscribedCourses.push(courseId);

    //     // Lưu thay đổi vào MongoDB
    //     await user.save();

    //     return res.status(200).json({ message: 'Course added successfully', user });
    // } catch (error) {
    //     console.error('Error adding course to user:', error);
    //     return res.status(500).json({ message: 'Server error' });
    // }


});

router.get("/payment-success", async (req, res) => {
    const { orderId, resultCode, message } = req.query;
    const email = req.session.email;
    console.log('>>> email 333: ', email);

    if (resultCode === '0') {
        console.log(`Giao dịch thành công. Mã đơn hàng: ${orderId}`);
        // res.send(`Giao dịch thành công. Mã đơn hàng: ${orderId}`);
        return res.redirect('http://localhost:3000/Gym-Website#/course');
    } else {
        console.log(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
        res.send(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
    }
});


function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}


router.post('/vnppayment', function (req, res, next) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var config = require('config');

    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');
    var vnpUrl = config.get('vnp_Url');
    var returnUrl = config.get('vnp_ReturnUrl');

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    console.log('>>> createDate, orderId: ', createDate, '  --  ', orderId);
    var amount = req.body.coursePrice || 0;
    console.log('>>> amount: ', amount)
    var bankCode = '';

    var orderInfo = 'Ngkn Check 1' || req.body.orderDescription;
    var orderType = 'other' || req.body.orderType;
    var locale = '';
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    console.log('----------------------------------URL------------------------------')
    console.log(vnpUrl)
    console.log('----------------------------------URL------------------------------')

    const { coursePrice, name, email, phone, courseId } = req.body;
    console.log('>>> email 1111: ', email);
    req.session.email = email;
    console.log('>>> req.session.email: ', req.session.email);

    res.status(200).json({ payUrl: vnpUrl });
});

router.get('/vnpay_ipn', function (req, res, next) {
    const email = req.session.email;
    console.log('>>> email 3333: ', email);

    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let config = require('config');
    let secretKey = config.get('vnp_HashSecret');
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) { //kiểm tra checksum
        if (checkOrderId) {
            if (checkAmount) {
                if (paymentStatus == "0") { //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if (rspCode == "00") {
                        //thanh cong
                        //paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        console.log('>>> email 4444: ', email);
                        console.log('>>> rspCode: ', rspCode);
                        res.status(200).json({ RspCode: '00', Message: 'Da Thanh Toan' })
                    }
                    else {
                        //that bai
                        //paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        console.log('>>> rspCode: ', rspCode);
                        // res.status(200).json({ RspCode: '24', Message: 'Huy' })
                        res.redirect('http://localhost:3000/#/course');
                    }
                }
                else {
                    console.log('>>> rspCode: ', rspCode);
                    res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' })
                }
            }
            else {
                console.log('>>> rspCode: ', rspCode);
                res.status(200).json({ RspCode: '04', Message: 'Amount invalid' })
            }
        }
        else {
            console.log('>>> rspCode: ', rspCode);
            res.status(200).json({ RspCode: '01', Message: 'Order not found' })
        }
    }
    else {
        console.log('>>> rspCode: ', rspCode);
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
    }
});


module.exports = router;
