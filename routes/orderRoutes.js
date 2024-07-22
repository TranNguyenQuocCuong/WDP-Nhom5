const express = require('express');
const Order = require('../models/Order');
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
const crypto = require("crypto");

router.post('/', async (req, res) => {
    const { orderItems, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, user, shippingAddress } = req.body;

    if (!user) {
        console.log('User ID is required');
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (orderItems && orderItems.length === 0) {
        console.log('No order items');
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const order = new Order({
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user,
            shippingAddress,
        });

        const createdOrder = await order.save();
        console.log('createdOrder success');

        let paymentUrl = '';

        if (paymentMethod === 'MoMo') {
            // Call MoMo payment API
            const paymentResponse = await axios.post(`http://localhost:5000/api/order/momopayment`, {
                amount: totalPrice
            });
            paymentUrl = paymentResponse.data.payUrl;
        } else if (paymentMethod === 'VnPay') {
            // Call VnPay payment API
            const paymentResponse = await axios.post(`http://localhost:5000/api/order/vnppayment`, {
                amount: totalPrice,
                orderDescription: 'Payment for order',
                orderType: 'other'
            });
            paymentUrl = paymentResponse.data.payUrl;
        }

        res.status(201).json({ order: createdOrder, payUrl: paymentUrl });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// MoMo Payment Endpoint
router.post("/momopayment", async (req, res) => {
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = 'http://localhost:5000/api/payments/payment-success';
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const requestType = "captureWallet";
    const amount = req.body.amount || 0;
    const orderId = `FitZone-${new Date().getTime()}-${uuidv4()}`;
    const requestId = orderId;
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretKey)
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
        res.status(200).json({ payUrl });
    } catch (error) {
        console.error('Error processing MoMo payment:', error);
        res.status(500).json({ message: 'Error processing payment' });
    }
});


router.get("/payment-success", async (req, res) => {
    try {
        if (resultCode === '0') {
            console.log(`Giao dịch thành công. Mã đơn hàng: ${orderId}`);

            // Update the order in the database
            await Order.findByIdAndUpdate(
                orderId,
                {
                    isPaid: true,
                    paidAt: new Date(), // Set the paidAt to the current date and time
                },
                { new: true } // Return the updated document
            );

            return res.redirect('http://localhost:3000/Gym-Website#/shop');
        } else {
            console.log(`Giao dịch thất bại. Thông báo từ MoMo: ${message}`);
            return res.redirect('http://localhost:3000/Gym-Website#/');
        }
    } catch (error) {
        console.error(`Error updating order: ${error}`);
        return res.redirect('http://localhost:3000/Gym-Website#/');
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
    var amount = req.body.amount || 0;
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


    res.status(200).json({ payUrl: vnpUrl });
});

router.get('/vnpay_ipn', async function (req, res, next) {
    try {
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
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        let paymentStatus = '0'; // Default to initial status
        let checkOrderId = true; // Assume orderId exists in the database
        let checkAmount = true; // Assume amount matches

        if (secureHash === signed) { // Check checksum
            if (checkOrderId) {
                if (checkAmount) {
                    if (paymentStatus === "0") { // Check transaction status
                        if (rspCode === "00") {
                            // Payment successful
                            console.log('>>> Payment successful. rspCode:', rspCode);

                            // Update the order in the database
                            await Order.findByIdAndUpdate(
                                orderId,
                                {
                                    isPaid: true,
                                    paidAt: new Date(), // Set paidAt to current date and time
                                },
                                { new: true } // Return updated document
                            );

                            return res.redirect('http://localhost:3000/Gym-Website#/shop');
                        } else {
                            // Payment failed
                            console.log('>>> Payment failed. rspCode:', rspCode);
                            return res.redirect('http://localhost:3000/#/shop');
                        }
                    } else {
                        // Order already updated
                        console.log('>>> Order already updated. rspCode:', rspCode);
                        return res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
                    }
                } else {
                    // Amount invalid
                    console.log('>>> Invalid amount. rspCode:', rspCode);
                    return res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
                }
            } else {
                // Order not found
                console.log('>>> Order not found. rspCode:', rspCode);
                return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
            }
        } else {
            // Checksum failed
            console.log('>>> Checksum failed. rspCode:', rspCode);
            return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
        }
    } catch (error) {
        console.error('>>> Error processing payment IPN:', error);
        return res.status(500).json({ RspCode: '99', Message: 'Internal server error' });
    }
});

module.exports = router;
